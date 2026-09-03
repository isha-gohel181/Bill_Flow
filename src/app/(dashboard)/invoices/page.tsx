"use client";

import React, { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoicesApi, clientsApi, settingsApi } from "@/lib/api";
import { Invoice, Client, PaginationMeta } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { InvoiceFilters } from "@/components/invoices/InvoiceFilters";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoicePagination } from "@/components/invoices/InvoicePagination";
import { InvoiceDeleteDialog } from "@/components/invoices/InvoiceDeleteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { toast } from "sonner";
import { Plus, FileText, FilterX } from "lucide-react";

export default function InvoicesPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Data States
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [currency, setCurrency] = useState<string>("INR");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Query Params States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [clientId, setClientId] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Status States
  const [totalInvoicesEver, setTotalInvoicesEver] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Debounce search input (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Load auxiliary data (Clients & Settings) once
  useEffect(() => {
    async function loadAuxData() {
      try {
        const [clientsRes, settingsRes] = await Promise.all([
          clientsApi.getClients(),
          settingsApi.getSettings(),
        ]);
        if (clientsRes.success) {
          setClients(clientsRes.clients || []);
        }
        if (settingsRes.success && settingsRes.settings?.currency) {
          setCurrency(settingsRes.settings.currency);
        }
      } catch (err) {
        console.warn("Failed to load clients/settings auxiliary data:", err);
      }
    }
    loadAuxData();
  }, []);

  // Fetch Invoices from Server API with all filter parameters
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (status !== "all") params.status = status;
      if (clientId !== "all") params.clientId = clientId;

      const res = await invoicesApi.getInvoices(params);

      if (!res.success) {
        setError(res.error || "Failed to load invoices");
        setInvoices([]);
        return;
      }

      setInvoices(res.invoices || []);
      if (res.pagination) {
        setPagination(res.pagination);
        // Track whether user has any invoices at all for empty state check
        if (!debouncedSearch && status === "all" && clientId === "all" && totalInvoicesEver === null) {
          setTotalInvoicesEver(res.pagination.total);
        }
      }
    } catch (err: any) {
      console.error("Fetch invoices error:", err);
      setError("An unexpected error occurred while loading invoices.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, clientId, sortBy, sortOrder, page, totalInvoicesEver]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Check if any filter is currently active
  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "all" ||
    clientId !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("all");
    setClientId("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const handleOpenDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDeleteOpen(true);
  };

  const handleDeleteInvoice = async (id: string): Promise<boolean> => {
    try {
      const res = await invoicesApi.deleteInvoice(id);
      if (!res.success) {
        toast.error(res.error || "This invoice cannot be deleted.");
        return false;
      }
      toast.success("Invoice deleted successfully");
      await fetchInvoices();
      return true;
    } catch (err: any) {
      toast.error(err.message || "This invoice cannot be deleted.");
      return false;
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    startTransition(() => {
      router.push(`/invoices/${invoice.id}`);
    });
  };

  const handleEditInvoice = (invoice: Invoice) => {
    startTransition(() => {
      router.push(`/invoices/${invoice.id}/edit`);
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState
          title="Unable to load invoices"
          description={error}
          onRetry={fetchInvoices}
        />
      </div>
    );
  }

  // True empty state (User has no invoices created at all)
  const isTrulyEmpty = totalInvoicesEver === 0 && !hasActiveFilters;

  return (
    <div className="space-y-6">
      {/* Control Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DDE2EC]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
            Invoices
          </h1>
          <p className="text-sm text-[#666666]">
            Manage invoices and track payments.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="bg-[#017E84] hover:bg-[#01686D] text-white font-medium rounded-md text-sm px-4 py-2 shadow-xs">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      {/* Main Content View */}
      {isTrulyEmpty ? (
        <EmptyState
          icon={<FileText className="h-6 w-6 text-[#714B67]" />}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments."
          actionLabel="Create Invoice"
          onAction={() => router.push("/invoices/new")}
        />
      ) : (
        <div className="space-y-4">
          {/* Server-Side Filter Bar */}
          <InvoiceFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={(val) => {
              setStatus(val || "all");
              setPage(1);
            }}
            clientId={clientId}
            onClientChange={(val) => {
              setClientId(val || "all");
              setPage(1);
            }}
            sortBy={sortBy}
            onSortByChange={(val) => {
              setSortBy(val || "createdAt");
              setPage(1);
            }}
            sortOrder={sortOrder}
            onSortOrderToggle={() => {
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              setPage(1);
            }}
            clients={clients}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Table or Filter No-Results State */}
          {invoices.length === 0 ? (
            <EmptyState
              icon={<FilterX className="h-6 w-6 text-amber-500" />}
              title="No invoices found"
              description="Try adjusting your search or filters."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            <>
              <InvoiceTable
                invoices={invoices}
                currency={currency}
                onView={handleViewInvoice}
                onEdit={handleEditInvoice}
                onDelete={handleOpenDelete}
              />

              {/* Server-Side Pagination Bar */}
              <InvoicePagination
                pagination={pagination}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <InvoiceDeleteDialog
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        invoice={selectedInvoice}
        onConfirmDelete={handleDeleteInvoice}
      />
    </div>
  );
}
