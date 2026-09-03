import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, invoiceItems, clients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { createInvoiceSchema } from "@/lib/validations/invoice";
import {
  calculateInvoiceTotals,
  generateInvoiceNumber,
  calculateEffectiveStatus,
} from "@/lib/invoice-utils";

export const dynamic = "force-dynamic";

// GET /api/invoices — List all invoices for the authenticated user
export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    // Query invoices with basic client info
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
      .where(eq(invoices.userId, user.id))
      .orderBy(desc(invoices.createdAt));

    // Calculate effective overdue status dynamically
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

    // Calculate monetary totals
    const totals = calculateInvoiceTotals(items, tax, discount);

    // Insert invoice
    const [newInvoice] = await db
      .insert(invoices)
      .values({
        userId: user.id,
        clientId,
        invoiceNumber,
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
