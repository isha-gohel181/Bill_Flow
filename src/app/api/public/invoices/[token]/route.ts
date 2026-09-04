import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, invoiceItems, clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateEffectiveStatus } from "@/lib/invoice-utils";
import { getOrCreateUserSettings } from "@/lib/settings-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ token: string }>;
}

// GET /api/public/invoices/:token — Public unauthenticated invoice view
export async function GET(req: Request, { params }: RouteParams) {
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

    // Query invoice by publicToken with client details
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
        client: {
          name: clients.name,
          company: clients.company,
          email: clients.email,
          address: clients.address,
          phone: clients.phone,
        },
      })
      .from(invoices)
      .innerJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.publicToken, token))
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

    // Fetch line items
    const items = await db
      .select({
        description: invoiceItems.description,
        quantity: invoiceItems.quantity,
        rate: invoiceItems.rate,
        amount: invoiceItems.amount,
      })
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, invoiceData.id));

    // Fetch business settings for invoice owner
    const settings = await getOrCreateUserSettings(invoiceData.userId);

    const effectiveStatus = calculateEffectiveStatus(
      invoiceData.status,
      invoiceData.dueDate
    );

    const isPayable =
      invoiceData.status !== "draft" && effectiveStatus !== "paid";

    return NextResponse.json(
      {
        success: true,
        invoice: {
          invoiceNumber: invoiceData.invoiceNumber,
          status: effectiveStatus,
          isPayable,
          business: {
            businessName: settings.businessName,
            name: settings.businessName,
            logoUrl: settings.logoUrl,
            currency: settings.currency,
          },
          issueDate: invoiceData.issueDate,
          dueDate: invoiceData.dueDate,
          subtotal: invoiceData.subtotal,
          taxRate: invoiceData.taxRate,
          taxAmount: invoiceData.taxAmount,
          discount: invoiceData.discount,
          total: invoiceData.total,
          notes: invoiceData.notes,
          client: invoiceData.client,
          items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/public/invoices/:token error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
