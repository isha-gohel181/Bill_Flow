import { NextResponse } from "next/server";
import { db } from "@/db";
import { businessSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { getOrCreateUserSettings } from "@/lib/settings-utils";

export const dynamic = "force-dynamic";

// GET /api/settings — Fetch authenticated user's business settings
export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const settings = await getOrCreateUserSettings(user.id);

    return NextResponse.json(
      {
        success: true,
        settings: {
          businessName: settings.businessName,
          logoUrl: settings.logoUrl,
          currency: settings.currency,
          invoicePrefix: settings.invoicePrefix,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/settings — Update authenticated user's business settings
export async function PUT(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();
    const parsed = updateSettingsSchema.safeParse(body);

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

    const { businessName, currency, invoicePrefix } = parsed.data;

    // Ensure settings record exists before updating
    const existing = await getOrCreateUserSettings(user.id);

    const [updatedSettings] = await db
      .update(businessSettings)
      .set({
        businessName,
        currency,
        invoicePrefix,
        updatedAt: new Date(),
      })
      .where(eq(businessSettings.userId, user.id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        settings: {
          businessName: updatedSettings.businessName,
          logoUrl: updatedSettings.logoUrl,
          currency: updatedSettings.currency,
          invoicePrefix: updatedSettings.invoicePrefix,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
