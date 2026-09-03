import { NextResponse } from "next/server";
import { auth } from "@/auth";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
  };
}

export async function requireAuth() {
  const user = await getSessionUser();

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      ),
    };
  }

  return {
    user,
    errorResponse: null,
  };
}
