import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, errorResponse } = await requireAuth();

  if (errorResponse) {
    return errorResponse;
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
    { status: 200 }
  );
}
