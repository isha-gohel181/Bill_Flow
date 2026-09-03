import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { clientSchema } from "@/lib/validations/client";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/clients/:id — Get a single client by ID (scoped to authenticated user)
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;

    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .limit(1);

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        client,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/clients/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/clients/:id — Update a client (scoped to authenticated user)
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;
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

    const [updatedClient] = await db
      .update(clients)
      .set({
        name,
        email,
        company: company || null,
        address: address || null,
        phone: phone || null,
        updatedAt: new Date(),
      })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning();

    if (!updatedClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        client: updatedClient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/clients/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/:id — Delete a client (scoped to authenticated user)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const { id } = await params;

    const [deletedClient] = await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning({ id: clients.id });

    if (!deletedClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Client not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Client deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/clients/:id error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
