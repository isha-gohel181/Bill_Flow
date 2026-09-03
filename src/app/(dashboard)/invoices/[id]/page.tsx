"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { invoicesApi, settingsApi } from "@/lib/api";
import { Invoice, BusinessSettings } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { InvoiceDocument } from "@/components/invoices/InvoiceDocument";
import { InvoiceDetailActions } from "@/components/invoices/InvoiceDetailActions";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { downloadInvoicePdf } from "@/lib/utils/pdf";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = use(params);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoiceRes, settingsRes] = await Promise.all([
        invoicesApi.getInvoice(id),
        settingsApi.getSettings(),
      ]);

      if (!invoiceRes.success || !invoiceRes.invoice) {
        setError(invoiceRes.error || "Invoice not found");
        setInvoice(null);
        return;
      }

      setInvoice(invoiceRes.invoice);

      if (settingsRes.success && settingsRes.settings) {
        setSettings(settingsRes.settings);
      }
    } catch (err: any) {
      console.error("Failed to load invoice details:", err);
      setError("An unexpected error occurred while loading the invoice.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  const handleDownloadPdf = () => {
    if (!invoice) return;
    try {
      downloadInvoicePdf(invoice.invoiceNumber);
    } catch (err) {
      toast.error("Unable to generate PDF.");
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
          description={error || "The requested invoice does not exist or has been removed."}
          onRetry={loadData}
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

  return (
    <div className="space-y-6 pb-12">
      {/* Top Control Panel Actions */}
      <InvoiceDetailActions
        invoice={invoice}
        onRefresh={loadData}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Main Invoice Document Preview */}
      <InvoiceDocument invoice={invoice} settings={settings} />
    </div>
  );
}
