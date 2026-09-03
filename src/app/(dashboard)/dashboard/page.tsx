"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardApi, settingsApi } from "@/lib/api";
import { DashboardData } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { DateDisplay } from "@/components/shared/DateDisplay";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import {
  Plus,
  TrendingUp,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [currency, setCurrency] = useState<string>("INR");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashRes, settingsRes] = await Promise.all([
        dashboardApi.getDashboard(),
        settingsApi.getSettings(),
      ]);

      if (!dashRes.success) {
        setError(dashRes.error || "Failed to load dashboard data");
        setLoading(false);
        return;
      }

      if (dashRes.summary && dashRes.recentInvoices) {
        setData({
          summary: dashRes.summary,
          recentInvoices: dashRes.recentInvoices,
          incomeOverTime: dashRes.incomeOverTime || [],
        });
      }

      if (settingsRes.success && settingsRes.settings?.currency) {
        setCurrency(settingsRes.settings.currency);
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("An unexpected error occurred while loading dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12">
        <ErrorState
          title="Unable to load dashboard"
          description={error || "Failed to connect to the backend server."}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  const { summary, recentInvoices, incomeOverTime } = data;
  const totalInvoicesCount = recentInvoices.length;

  // Empty state if user has no invoices at all
  if (
    totalInvoicesCount === 0 &&
    parseFloat(summary.totalEarned) === 0 &&
    parseFloat(summary.outstanding) === 0 &&
    parseFloat(summary.overdue) === 0
  ) {
    return (
      <div className="space-y-6">
        {/* Control Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DDE2EC]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
              Dashboard
            </h1>
            <p className="text-sm text-[#666666]">
              Overview of your business finances and invoicing activity.
            </p>
          </div>
          <Link href="/invoices">
            <Button className="bg-[#017E84] hover:bg-[#01686D] text-white font-medium rounded-md text-sm px-4 py-2 shadow-xs">
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </Link>
        </div>

        <EmptyState
          icon={<FileText className="h-6 w-6 text-[#714B67]" />}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments and revenue."
          actionLabel="Create Invoice"
          onAction={() => router.push("/invoices")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Odoo-Style Control Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DDE2EC]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
            Dashboard
          </h1>
          <p className="text-sm text-[#666666]">
            Real-time insights into your business revenue and invoice statuses.
          </p>
        </div>
        <Link href="/invoices">
          <Button className="bg-[#017E84] hover:bg-[#01686D] text-white font-medium rounded-md text-sm px-4 py-2 shadow-xs">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      {/* 4 Professional KPI Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Earned */}
        <Card className="bg-white border-[#DDE2EC] rounded-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Total Earned
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">
              <CurrencyDisplay amount={summary.totalEarned} currency={currency} />
            </div>
            <p className="text-xs text-[#666666] mt-1">From paid invoices</p>
          </CardContent>
        </Card>

        {/* Card 2: Outstanding */}
        <Card className="bg-white border-[#DDE2EC] rounded-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Outstanding
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">
              <CurrencyDisplay amount={summary.outstanding} currency={currency} />
            </div>
            <p className="text-xs text-[#666666] mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        {/* Card 3: Overdue */}
        <Card className="bg-white border-[#DDE2EC] rounded-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Overdue
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">
              <CurrencyDisplay amount={summary.overdue} currency={currency} />
            </div>
            <p className="text-xs text-[#666666] mt-1">Past due date</p>
          </CardContent>
        </Card>

        {/* Card 4: Total Invoices */}
        <Card className="bg-white border-[#DDE2EC] rounded-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Total Invoices
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-purple-50 text-[#714B67] flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">
              {totalInvoicesCount}
            </div>
            <p className="text-xs text-[#666666] mt-1">All invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: Income Chart & Recent Invoices */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* 6-Month Income Chart Panel */}
        <Card className="bg-white border-[#DDE2EC] rounded-md shadow-xs lg:col-span-3">
          <CardHeader className="pb-2 border-b border-[#DDE2EC]/60">
            <CardTitle className="text-base font-semibold text-[#212529]">
              Income Overview
            </CardTitle>
            <CardDescription className="text-xs text-[#666666]">
              Paid invoices over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <IncomeChart data={incomeOverTime} currency={currency} />
          </CardContent>
        </Card>

        {/* Recent Invoices Panel */}
        <Card className="bg-white border-[#DDE2EC] rounded-md shadow-xs lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#DDE2EC]/60 pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-[#212529]">
                Recent Invoices
              </CardTitle>
              <CardDescription className="text-xs text-[#666666]">
                Latest invoices across all clients
              </CardDescription>
            </div>
            <Link href="/invoices">
              <Button variant="ghost" size="sm" className="text-xs text-[#017E84] hover:text-[#01686D] hover:bg-teal-50 font-medium">
                View All Invoices <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#DDE2EC] hover:bg-transparent bg-slate-50/50">
                    <TableHead className="font-semibold text-xs text-[#666666]">Invoice</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666666]">Client</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666666]">Issue Date</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666666]">Due Date</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666666] text-right">Amount</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666666] text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      onClick={() => router.push("/invoices")}
                      className="cursor-pointer hover:bg-slate-50/80 border-b border-[#DDE2EC]/60 transition-colors"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-[#017E84]">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-[#212529]">
                        {inv.client?.name || "Client"}
                      </TableCell>
                      <TableCell className="text-xs">
                        <DateDisplay date={inv.issueDate} />
                      </TableCell>
                      <TableCell className="text-xs">
                        <DateDisplay date={inv.dueDate} />
                      </TableCell>
                      <TableCell className="text-xs text-right font-semibold text-[#212529]">
                        <CurrencyDisplay amount={inv.total} currency={currency} />
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={inv.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
