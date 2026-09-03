import { NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, clients } from "@/db/schema";
import { eq, and, or, sum, desc, lt, gte } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-utils";
import { calculateEffectiveStatus } from "@/lib/invoice-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) {
      return errorResponse;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Calculate Summary Aggregation
    // Total Earned (Paid Invoices)
    const [earnedResult] = await db
      .select({ totalEarned: sum(invoices.total) })
      .from(invoices)
      .where(and(eq(invoices.userId, user.id), eq(invoices.status, "paid")));

    // Outstanding (Sent or Overdue Invoices)
    const [outstandingResult] = await db
      .select({ outstanding: sum(invoices.total) })
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, user.id),
          or(eq(invoices.status, "sent"), eq(invoices.status, "overdue"))
        )
      );

    // Overdue (Status = overdue OR (status = sent AND dueDate < today))
    const [overdueResult] = await db
      .select({ overdue: sum(invoices.total) })
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, user.id),
          or(
            eq(invoices.status, "overdue"),
            and(eq(invoices.status, "sent"), lt(invoices.dueDate, today))
          )
        )
      );

    const totalEarned = earnedResult?.totalEarned
      ? Number(earnedResult.totalEarned).toFixed(2)
      : "0.00";

    const outstanding = outstandingResult?.outstanding
      ? Number(outstandingResult.outstanding).toFixed(2)
      : "0.00";

    const overdue = overdueResult?.overdue
      ? Number(overdueResult.overdue).toFixed(2)
      : "0.00";

    // 2. Fetch Recent 5 Invoices
    const recentInvoicesData = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        total: invoices.total,
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        createdAt: invoices.createdAt,
        client: {
          id: clients.id,
          name: clients.name,
          company: clients.company,
        },
      })
      .from(invoices)
      .innerJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.userId, user.id))
      .orderBy(desc(invoices.createdAt))
      .limit(5);

    const recentInvoices = recentInvoicesData.map((inv) => ({
      ...inv,
      status: calculateEffectiveStatus(inv.status, inv.dueDate),
    }));

    // 3. Build 6-Month Income Chart Data
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthsMap = new Map<
      string,
      { month: string; label: string; amountCents: number }
    >();

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = String(d.getMonth() + 1).padStart(2, "0");
      const monthKey = `${year}-${monthNum}`;
      const label = monthNames[d.getMonth()];
      monthsMap.set(monthKey, { month: monthKey, label, amountCents: 0 });
    }

    // Earliest start date for chart
    const firstMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1,
      0,
      0,
      0,
      0
    );

    // Fetch paid invoices from the last 6 months
    const paidInvoices = await db
      .select({
        total: invoices.total,
        issueDate: invoices.issueDate,
      })
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, user.id),
          eq(invoices.status, "paid"),
          gte(invoices.issueDate, firstMonthDate)
        )
      );

    for (const inv of paidInvoices) {
      const invDate = new Date(inv.issueDate);
      const year = invDate.getFullYear();
      const monthNum = String(invDate.getMonth() + 1).padStart(2, "0");
      const monthKey = `${year}-${monthNum}`;

      if (monthsMap.has(monthKey)) {
        const item = monthsMap.get(monthKey)!;
        item.amountCents += Math.round(Number(inv.total) * 100);
      }
    }

    const incomeOverTime = Array.from(monthsMap.values()).map((m) => ({
      month: m.month,
      label: m.label,
      amount: (m.amountCents / 100).toFixed(2),
    }));

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalEarned,
          outstanding,
          overdue,
        },
        recentInvoices,
        incomeOverTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
