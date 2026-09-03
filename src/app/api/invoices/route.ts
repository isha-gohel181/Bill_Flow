import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, invoiceItems, clients } from "@/db/schema";
import { eq, and, or, ilike, count, asc, desc, lt, gte, SQL } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { createInvoiceSchema } from "@/lib/validations/invoice";
import { invoiceQuerySchema } from "@/lib/validations/invoice-query";
import {
  calculateInvoiceTotals,
  generateInvoiceNumber,
  calculateEffectiveStatus,
} from "@/lib/invoice-utils";

export const dynamic = "force-dynamic";

// GET /api/invoices — Server-side Search, Filtering, Sorting, and Pagination
export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { searchParams } = new URL(req.url);
    const rawParams = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      clientId: searchParams.get("clientId") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const parsed = invoiceQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { search, status, clientId, sortBy, sortOrder, page, limit } = parsed.data;

    // Validate client ownership if clientId is provided
    if (clientId) {
      const [clientRecord] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, clientId), eq(clients.userId, user.id)))
        .limit(1);

      if (!clientRecord) {
        return NextResponse.json(
          {
            success: false,
            error: "Client not found or does not belong to user",
          },
          { status: 404 }
        );
      }
    }

    // Build filter conditions
    const conditions: SQL[] = [eq(invoices.userId, user.id)];

    if (clientId) {
      conditions.push(eq(invoices.clientId, clientId));
    }

    if (search) {
      const searchPattern = `%${search}%`;
      const searchCondition = or(
        ilike(invoices.invoiceNumber, searchPattern),
        ilike(clients.name, searchPattern),
        ilike(clients.email, searchPattern),
        ilike(clients.company, searchPattern)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    if (status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (status === "draft") {
        conditions.push(eq(invoices.status, "draft"));
      } else if (status === "paid") {
        conditions.push(eq(invoices.status, "paid"));
      } else if (status === "sent") {
        const sentCond = and(eq(invoices.status, "sent"), gte(invoices.dueDate, today));
        if (sentCond) conditions.push(sentCond);
      } else if (status === "overdue") {
        const overdueCond = or(
          eq(invoices.status, "overdue"),
          and(eq(invoices.status, "sent"), lt(invoices.dueDate, today))
        );
        if (overdueCond) conditions.push(overdueCond);
      }
    }

    // Build sort mapping
    const sortColumnMap = {
      createdAt: invoices.createdAt,
      issueDate: invoices.issueDate,
      dueDate: invoices.dueDate,
      invoiceNumber: invoices.invoiceNumber,
      total: invoices.total,
      status: invoices.status,
    };

    const sortColumn = sortColumnMap[sortBy] || invoices.createdAt;
    const orderFn = sortOrder === "asc" ? asc : desc;

    // Calculate total matching records count
    const whereClause = and(...conditions);
    const [countResult] = await db
      .select({ totalCount: count() })
      .from(invoices)
      .innerJoin(clients, eq(invoices.clientId, clients.id))
      .where(whereClause);

    const total = Number(countResult?.totalCount || 0);
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
    const offset = (page - 1) * limit;

    // Fetch paginated invoices
    const userInvoices = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        subtotal: invoices.subtotal,
        taxRate: invoices.taxRate,
        taxAmount: invoices.taxAmount,
        discount: invoices.discount,
        total: invoices.total,
        notes: invoices.notes,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        client: {
          id: clients.id,
          name: clients.name,
          email: clients.email,
          company: clients.company,
        },
      })
      .from(invoices)
      .innerJoin(clients, eq(invoices.clientId, clients.id))
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);

    // Dynamic overdue status formatting for list items
    const formattedInvoices = userInvoices.map((inv) => {
      const effectiveStatus = calculateEffectiveStatus(inv.status, inv.dueDate);
      return {
        ...inv,
        status: effectiveStatus,
      };
    });

    return NextResponse.json(
      {
        success: true,
        invoices: formattedInvoices,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST /api/invoices — Create a new invoice with line items
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();
    const parsed = createInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      clientId,
      issueDate,
      dueDate,
      tax = 0,
      discount = 0,
      status = "draft",
      notes,
      items,
    } = parsed.data;

    // Verify client belongs to authenticated user
    const [clientRecord] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (!clientRecord || clientRecord.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found or does not belong to user",
        },
        { status: 404 }
      );
    }

    // Generate unique invoice number for user
    const invoiceNumber = await generateInvoiceNumber(user.id);
    const { generateSecureToken } = await import("@/lib/public-invoice-utils");
    const publicToken = generateSecureToken();

    // Calculate monetary totals
    const totals = calculateInvoiceTotals(items, tax, discount);

    // Insert invoice
    const [newInvoice] = await db
      .insert(invoices)
      .values({
        userId: user.id,
        clientId,
        invoiceNumber,
        publicToken,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal: totals.subtotal,
        taxRate: totals.taxRate,
        taxAmount: totals.taxAmount,
        discount: totals.discount,
        total: totals.total,
        status,
        notes: notes || null,
      })
      .returning();

    // Insert line items
    const itemValues = totals.calculatedItems.map((item) => ({
      invoiceId: newInvoice.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    }));

    const createdItems = await db
      .insert(invoiceItems)
      .values(itemValues)
      .returning();

    const createdResult = {
      ...newInvoice,
      status: calculateEffectiveStatus(newInvoice.status, newInvoice.dueDate),
      client: {
        id: clientRecord.id,
        name: clientRecord.name,
        email: clientRecord.email,
        company: clientRecord.company,
      },
      items: createdItems,
    };

    return NextResponse.json(
      {
        success: true,
        invoice: createdResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
