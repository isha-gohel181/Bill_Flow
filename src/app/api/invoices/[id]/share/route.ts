import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import {
  generateSecureToken,
  getPublicInvoiceUrl,
} from "@/lib/public-invoice-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/invoices/:id/share — Generate stable shareable URL and transition draft to sent
export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;

    // Fetch invoice for authenticated user
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

    // Reuse existing token or generate new one
    const publicToken = existingInvoice.publicToken || generateSecureToken();

    // Transition status: draft -> sent (sent, paid, overdue remain unchanged)
    const newStatus =
      existingInvoice.status === "draft" ? "sent" : existingInvoice.status;

    // Update database if token was missing or status transitioned
    if (
      !existingInvoice.publicToken ||
      newStatus !== existingInvoice.status
    ) {
      await db
        .update(invoices)
        .set({
          publicToken,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(and(eq(invoices.id, id), eq(invoices.userId, user.id)));
    }

    const publicUrl = getPublicInvoiceUrl(publicToken);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        publicToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/invoices/:id/share error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
