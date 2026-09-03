"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoicesApi, clientsApi, settingsApi } from "@/lib/api";
import { Invoice, Client } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { toast } from "sonner";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [invoiceRes, clientsRes, settingsRes] = await Promise.all([
          invoicesApi.getInvoice(id),
          clientsApi.getClients(),
          settingsApi.getSettings(),
        ]);

        if (!invoiceRes.success || !invoiceRes.invoice) {
          setError(invoiceRes.error || "Invoice not found");
          setLoading(false);
          return;
        }

        setInvoice(invoiceRes.invoice);

        if (clientsRes.success) {
          setClients(clientsRes.clients || []);
        }

        if (settingsRes.success && settingsRes.settings?.currency) {
          setCurrency(settingsRes.settings.currency);
        }
      } catch (err: any) {
        console.error("Failed to load invoice for editing:", err);
        setError("An unexpected error occurred while fetching invoice.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleSubmit = async (formData: any): Promise<boolean> => {
    if (invoice?.status === "paid") {
      toast.error("Paid invoices cannot be modified.");
      return false;
    }

    setSubmitting(true);
    try {
      const res = await invoicesApi.updateInvoice(id, formData);
      if (!res.success) {
        toast.error(res.error || "Failed to update invoice");
        setSubmitting(false);
        return false;
      }

      toast.success("Invoice updated successfully");
      router.push("/invoices");
      return true;
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setSubmitting(false);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageSkeleton />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="py-12 space-y-4">
        <ErrorState
          title="Invoice Not Found"
          description={error || "The requested invoice could not be located."}
        />
        <div className="text-center">
          <Link href="/invoices">
            <Button variant="outline" size="sm" className="border-[#DDE2EC]">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Invoices
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";

  return (
    <div className="space-y-6">
      {/* Control Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#DDE2EC]">
        <div className="flex items-center gap-3">
          <Link href="/invoices">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-[#DDE2EC] text-[#666666]"
              title="Back to invoices"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#212529]">
              Edit Invoice <span className="font-mono text-[#017E84]">({invoice.invoiceNumber})</span>
            </h1>
            <p className="text-xs text-[#666666]">
              Update line items, billing dates, tax, or discount notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link href="/invoices">
            <Button variant="outline" disabled={submitting} className="text-xs border-[#DDE2EC]">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            form="invoice-form"
            disabled={submitting || isPaid}
            className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4 shadow-xs disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Paid Protection Warning Banner */}
      {isPaid && (
        <div className="p-4 rounded-md border border-amber-200 bg-amber-50/70 text-amber-900 text-xs flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">This invoice has been paid and cannot be modified.</p>
            <p className="text-amber-700 mt-0.5">
              Financial and line item records for settled invoices are locked for accounting compliance.
            </p>
          </div>
        </div>
      )}

      {/* Main Invoice Form */}
      <InvoiceForm
        initialData={invoice}
        clients={clients}
        currency={currency}
        disabled={submitting || isPaid}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
