import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, invoiceItems, clients } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { updateInvoiceSchema } from "@/lib/validations/invoice";
import {
  calculateInvoiceTotals,
  calculateEffectiveStatus,
} from "@/lib/invoice-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/invoices/:id — Fetch single invoice with client and line items
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;

    // Query invoice with client details
    const [invoiceData] = await db
      .select({
        id: invoices.id,
        userId: invoices.userId,
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
          address: clients.address,
          phone: clients.phone,
        },
      })
      .from(invoices)
      .innerJoin(clients, eq(invoices.clientId, clients.id))
      .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)))
      .limit(1);

    if (!invoiceData) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    // Query line items
    const items = await db
      .select({
        id: invoiceItems.id,
        description: invoiceItems.description,
        quantity: invoiceItems.quantity,
        rate: invoiceItems.rate,
        amount: invoiceItems.amount,
        createdAt: invoiceItems.createdAt,
      })
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id));

    const effectiveStatus = calculateEffectiveStatus(
      invoiceData.status,
      invoiceData.dueDate
    );

    return NextResponse.json(
      {
        success: true,
        invoice: {
          ...invoiceData,
          status: effectiveStatus,
          items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/invoices/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/:id — Update invoice details and items (protected if paid)
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = updateInvoiceSchema.safeParse(body);
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

    // Fetch existing invoice
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)))
      .limit(1);

    if (!existingInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    // Paid invoice protection
    if (existingInvoice.status === "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "Paid invoices cannot be modified",
        },
        { status: 400 }
      );
    }

    const {
      clientId,
      issueDate,
      dueDate,
      tax,
      discount,
      status,
      notes,
      items,
    } = parsed.data;

    // Verify updated client if changed
    let targetClientId = existingInvoice.clientId;
    if (clientId && clientId !== existingInvoice.clientId) {
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
      targetClientId = clientRecord.id;
    }

    // Get current line items if items array is not provided
    let finalItems: Array<{ description: string; quantity: number; rate: number }> = [];
    if (items && items.length > 0) {
      finalItems = items;
    } else {
      const dbItems = await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, id));
      finalItems = dbItems.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity),
        rate: Number(i.rate),
      }));
    }

    const newTaxRate = tax !== undefined ? tax : Number(existingInvoice.taxRate);
    const newDiscount = discount !== undefined ? discount : Number(existingInvoice.discount);

    const totals = calculateInvoiceTotals(finalItems, newTaxRate, newDiscount);

    // Update invoice record
    const [updatedInvoice] = await db
      .update(invoices)
      .set({
        clientId: targetClientId,
        issueDate: issueDate ? new Date(issueDate) : existingInvoice.issueDate,
        dueDate: dueDate ? new Date(dueDate) : existingInvoice.dueDate,
        subtotal: totals.subtotal,
        taxRate: totals.taxRate,
        taxAmount: totals.taxAmount,
        discount: totals.discount,
        total: totals.total,
        status: status || existingInvoice.status,
        notes: notes !== undefined ? notes : existingInvoice.notes,
        updatedAt: new Date(),
      })
      .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)))
      .returning();

    // If items provided, replace line items
    let updatedItems = [];
    if (items && items.length > 0) {
      await db
        .delete(invoiceItems)
        .where(eq(invoiceItems.invoiceId, id));

      const itemValues = totals.calculatedItems.map((item) => ({
        invoiceId: id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      }));

      updatedItems = await db
        .insert(invoiceItems)
        .values(itemValues)
        .returning();
    } else {
      updatedItems = await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, id));
    }

    // Fetch client info for response
    const [clientData] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, targetClientId));

    const updatedResult = {
      ...updatedInvoice,
      status: calculateEffectiveStatus(
        updatedInvoice.status,
        updatedInvoice.dueDate
      ),
      client: {
        id: clientData.id,
        name: clientData.name,
        email: clientData.email,
        company: clientData.company,
      },
      items: updatedItems,
    };

    return NextResponse.json(
      {
        success: true,
        invoice: updatedResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/invoices/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/:id — Delete invoice (protected if paid)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;

    // Check if invoice exists and user owns it
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)))
      .limit(1);

    if (!existingInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    // Protect paid invoices from deletion
    if (existingInvoice.status === "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "Paid invoices cannot be deleted",
        },
        { status: 400 }
      );
    }

    await db
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)));

    return NextResponse.json(
      {
        success: true,
        message: "Invoice deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/invoices/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
