"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoicesApi } from "@/lib/api";
import { Invoice } from "@/types/frontend";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { InvoiceDeleteDialog } from "./InvoiceDeleteDialog";
import { InvoiceShareDialog } from "./InvoiceShareDialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit2,
  Printer,
  Download,
  Share2,
  Trash2,
  Loader2,
} from "lucide-react";

interface InvoiceDetailActionsProps {
  invoice: Invoice;
  onRefresh: () => void;
  onDownloadPdf: () => void;
}

export const InvoiceDetailActions: React.FC<InvoiceDetailActionsProps> = ({
  invoice,
  onRefresh,
  onDownloadPdf,
}) => {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [sharing, setSharing] = useState(false);

  const isPaid = invoice.status === "paid";

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await invoicesApi.shareInvoice(invoice.id);
      if (!res.success || !res.url) {
        toast.error(res.error || "Unable to create invoice share link.");
        setSharing(false);
        return;
      }

      setShareUrl(res.url);
      setShareOpen(true);
      // If sharing converted a draft invoice to sent status on backend, refresh invoice data
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Unable to create invoice link.");
    } finally {
      setSharing(false);
    }
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      const res = await invoicesApi.deleteInvoice(id);
      if (!res.success) {
        toast.error(res.error || "This invoice cannot be deleted.");
        return false;
      }

      toast.success("Invoice deleted successfully");
      router.push("/invoices");
      return true;
    } catch (err: any) {
      toast.error(err.message || "This invoice cannot be deleted.");
      return false;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#DDE2EC] print:hidden">
      {/* Left: Back Button & Header Info */}
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
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-mono font-bold text-[#017E84]">
            {invoice.invoiceNumber}
          </h1>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Right: Actions Group */}
      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        {/* Edit Button */}
        {isPaid ? (
          <Button
            disabled
            className="bg-[#017E84] text-white text-xs font-medium px-3.5 h-9 opacity-50 cursor-not-allowed"
            title="Paid invoices cannot be modified."
          >
            <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
        ) : (
          <Link href={`/invoices/${invoice.id}/edit`}>
            <Button className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-3.5 h-9 shadow-xs">
              <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
          </Link>
        )}

        {/* Print Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="h-9 px-3 text-xs border-[#DDE2EC] bg-white text-[#212529]"
          title="Print invoice"
        >
          <Printer className="mr-1.5 h-3.5 w-3.5 text-[#666666]" /> Print
        </Button>

        {/* Download PDF Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadPdf}
          className="h-9 px-3 text-xs border-[#DDE2EC] bg-white text-[#212529]"
          title="Download PDF"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-[#666666]" /> Download PDF
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          disabled={sharing}
          className="h-9 px-3 text-xs border-[#DDE2EC] bg-white text-[#212529]"
          title="Share shareable link"
        >
          {sharing ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Share2 className="mr-1.5 h-3.5 w-3.5 text-[#666666]" />
          )}
          Share
        </Button>

        {/* Delete Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="h-9 px-2.5 text-xs border-[#DDE2EC] text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          title="Delete invoice"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Share Dialog Modal */}
      <InvoiceShareDialog
        isOpen={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
      />

      {/* Delete Dialog Modal */}
      <InvoiceDeleteDialog
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        invoice={invoice}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
};
