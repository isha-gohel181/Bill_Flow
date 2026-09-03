import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Perform a lightweight query to verify the Neon connection
    await db.execute(sql`SELECT 1`);

    return NextResponse.json(
      {
        success: true,
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        database: "disconnected",
        error: "Unable to establish database connection",
      },
      { status: 500 }
    );
  }
}