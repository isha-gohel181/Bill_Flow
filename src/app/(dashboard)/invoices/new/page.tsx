"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoicesApi, clientsApi, settingsApi } from "@/lib/api";
import { Client } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
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
        console.error("Failed to load create invoice form data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (formData: any): Promise<boolean> => {
    setSubmitting(true);
    try {
      const res = await invoicesApi.createInvoice(formData);
      if (!res.success) {
        toast.error(res.error || "Failed to create invoice");
        setSubmitting(false);
        return false;
      }

      toast.success("Invoice created successfully");
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
              Create Invoice
            </h1>
            <p className="text-xs text-[#666666]">
              Draft a new client invoice with automatic numbering and financial calculations.
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
            disabled={submitting}
            className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4 shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>

      {/* Main Invoice Form */}
      <InvoiceForm
        clients={clients}
        currency={currency}
        disabled={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
