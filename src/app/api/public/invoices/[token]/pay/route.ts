import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ token: string }>;
}

// POST /api/public/invoices/:token/pay — Simulated payment processing & state transition
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { token } = await params;

    if (!token || token.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    // Query invoice by publicToken
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.publicToken, token))
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

    // Rule 1: Draft invoices cannot be paid
    if (existingInvoice.status === "draft") {
      return NextResponse.json(
        {
          success: false,
          error: "Draft invoices cannot be paid. Please share or send the invoice first.",
        },
        { status: 400 }
      );
    }

    // Rule 2: Idempotency check — Already paid invoice
    if (existingInvoice.status === "paid") {
      return NextResponse.json(
        {
          success: true,
          message: "Invoice is already paid",
          invoice: {
            invoiceNumber: existingInvoice.invoiceNumber,
            status: "paid",
            total: existingInvoice.total,
          },
        },
        { status: 200 }
      );
    }

    // Rule 3: Atomic payment state transition to 'paid' (for sent/overdue)
    const [updatedInvoice] = await db
      .update(invoices)
      .set({
        status: "paid",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(invoices.id, existingInvoice.id),
          ne(invoices.status, "paid")
        )
      )
      .returning();

    const finalInvoice = updatedInvoice || existingInvoice;

    return NextResponse.json(
      {
        success: true,
        message: "Payment successful",
        invoice: {
          invoiceNumber: finalInvoice.invoiceNumber,
          status: "paid",
          total: finalInvoice.total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/public/invoices/:token/pay error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
