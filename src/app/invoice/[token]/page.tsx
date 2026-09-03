"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import { publicInvoicesApi } from "@/lib/api";
import { Invoice, BusinessSettings } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { PublicInvoiceHeader } from "@/components/public-invoice/PublicInvoiceHeader";
import { PublicInvoiceItems } from "@/components/public-invoice/PublicInvoiceItems";
import { PublicInvoiceSummary } from "@/components/public-invoice/PublicInvoiceSummary";
import { PaymentDialog } from "@/components/public-invoice/PaymentDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, AlertCircle, RefreshCw } from "lucide-react";

interface PublicInvoicePageProps {
  params: Promise<{ token: string }>;
}

export default function PublicInvoicePage({ params }: PublicInvoicePageProps) {
  const { token } = use(params);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [business, setBusiness] = useState<BusinessSettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const fetchPublicInvoice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await publicInvoicesApi.getPublicInvoice(token);
      if (!res.success || !res.invoice) {
        setError(res.error || "Invoice not found");
        setInvoice(null);
        return;
      }

      setInvoice(res.invoice);
      if (res.invoice.business) {
        setBusiness(res.invoice.business);
      }
    } catch (err: any) {
      console.error("Fetch public invoice error:", err);
      setError("An unexpected error occurred while loading the invoice.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPublicInvoice();
    }
  }, [token, fetchPublicInvoice]);

  const handleConfirmPayment = async (): Promise<boolean> => {
    try {
      const res = await publicInvoicesApi.payPublicInvoice(token);
      if (!res.success) {
        toast.error(res.error || "Payment could not be completed.");
        return false;
      }

      toast.success("Payment successful!");
      setPaidSuccess(true);
      await fetchPublicInvoice();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Payment processing failed.");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FBFD] py-8 px-4 flex justify-center">
        <div className="bg-white border border-[#DDE2EC] rounded-md p-6 sm:p-8 w-full max-w-4xl space-y-6 shadow-xs">
          <div className="flex justify-between items-center pb-6 border-b border-[#DDE2EC]">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-64 ml-auto" />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#F9FBFD] flex items-center justify-center p-4">
        <div className="bg-white border border-[#DDE2EC] rounded-md p-8 max-w-md w-full text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-[#212529]">Invoice Not Found</h2>
          <p className="text-xs text-[#666666]">
            {error || "This invoice link may be invalid, expired, or has been removed."}
          </p>
          <Button
            onClick={fetchPublicInvoice}
            variant="outline"
            size="sm"
            className="border-[#DDE2EC] text-xs mt-2"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currency = business?.currency || "INR";
  const isPaid = invoice.status === "paid";
  const isDraft = invoice.status === "draft";
  const isPayable = (invoice.status === "sent" || invoice.status === "overdue") && !isPaid;

  return (
    <div className="min-h-screen bg-[#F9FBFD] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Paid Success Banner */}
        {(isPaid || paidSuccess) && (
          <div className="p-4 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">Payment Received</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Thank you! This invoice has been fully settled.
              </p>
            </div>
          </div>
        )}

        {/* Draft Notice Banner */}
        {isDraft && (
          <div className="p-4 rounded-md border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-950">Draft Invoice</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                This invoice is not available for online payment yet.
              </p>
            </div>
          </div>
        )}

        {/* Main Document Panel */}
        <div className="bg-white border border-[#DDE2EC] rounded-md shadow-xs p-6 sm:p-8 space-y-8">
          {/* Business Header */}
          <PublicInvoiceHeader invoice={invoice} business={business} />

          {/* Line Items & Client Bill To */}
          <PublicInvoiceItems invoice={invoice} currency={currency} />

          {/* Financial Breakdown */}
          <PublicInvoiceSummary invoice={invoice} currency={currency} />

          {/* Payment Section */}
          <div className="pt-6 border-t border-[#DDE2EC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#666666]">
              {isPayable && (
                <p>Click below to make a test payment for this invoice.</p>
              )}
              {isPaid && (
                <p className="text-emerald-700 font-medium">Invoice settled on {invoice.updatedAt ? new Date(invoice.updatedAt).toLocaleDateString() : "today"}.</p>
              )}
            </div>

            {isPayable && (
              <Button
                onClick={() => setPaymentOpen(true)}
                className="bg-[#017E84] hover:bg-[#01686D] text-white font-medium text-sm px-6 py-2.5 shadow-xs w-full sm:w-auto"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Pay Invoice
              </Button>
            )}

            {isPaid && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> Settled / Paid
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-[#666666] pt-2">
          Powered by <span className="font-bold text-[#714B67]">BillFlow</span> — Invoicing System
        </div>
      </div>

      {/* Simulated Payment Dialog */}
      <PaymentDialog
        isOpen={paymentOpen}
        onOpenChange={setPaymentOpen}
        invoiceNumber={invoice.invoiceNumber}
        amount={invoice.total}
        currency={currency}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
