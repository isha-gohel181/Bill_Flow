import { NextResponse } from "next/server";
import { db } from "@/db";
import { businessSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { getOrCreateUserSettings } from "@/lib/settings-utils";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// POST /api/settings/logo — Upload business logo image
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const formData = await req.formData();
    const file = (formData.get("logo") || formData.get("file")) as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          error: "No image file provided",
        },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Allowed formats: PNG, JPEG, WebP",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 2 MB limit",
        },
        { status: 400 }
      );
    }

    let logoUrl = "";

    // Use Vercel Blob if environment token exists, fallback to Data URL for reliable local testing
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`logos/${user.id}-${Date.now()}-${file.name}`, file, {
          access: "public",
        });
        logoUrl = blob.url;
      } catch (blobErr) {
        console.warn("Vercel Blob upload warning, using Data URL fallback:", blobErr);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        logoUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      logoUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    // Ensure settings record exists and update logo_url
    await getOrCreateUserSettings(user.id);

    const [updated] = await db
      .update(businessSettings)
      .set({
        logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(businessSettings.userId, user.id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        logoUrl: updated.logoUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/settings/logo error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/settings/logo — Remove business logo
export async function DELETE() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    await getOrCreateUserSettings(user.id);

    await db
      .update(businessSettings)
      .set({
        logoUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(businessSettings.userId, user.id));

    return NextResponse.json(
      {
        success: true,
        message: "Logo removed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/settings/logo error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
