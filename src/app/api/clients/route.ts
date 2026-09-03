import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { clientSchema } from "@/lib/validations/client";

export const dynamic = "force-dynamic";

// GET /api/clients — List all clients for the authenticated user
export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const userClients = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, user.id))
      .orderBy(desc(clients.createdAt));

    return NextResponse.json(
      {
        success: true,
        clients: userClients,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST /api/clients — Create a new client for the authenticated user
export async function POST(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const body = await req.json();
    const parsed = clientSchema.safeParse(body);

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

    const { name, email, company, address, phone } = parsed.data;

    const [newClient] = await db
      .insert(clients)
      .values({
        userId: user.id,
        name,
        email,
        company: company || null,
        address: address || null,
        phone: phone || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        client: newClient,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
