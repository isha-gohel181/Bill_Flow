"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, ExternalLink, Check } from "lucide-react";

interface InvoiceShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export const InvoiceShareDialog: React.FC<InvoiceShareDialogProps> = ({
  isOpen,
  onOpenChange,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Invoice link copied to clipboard");
        setTimeout(() => setCopied(false), 2500);
      } else {
        toast.error("Unable to copy link automatically. Please copy manually.");
      }
    } catch (err) {
      toast.error("Unable to copy link");
    }
  };

  const handleOpenLink = () => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#DDE2EC]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#212529]">
            Share Invoice
          </DialogTitle>
          <DialogDescription className="text-xs text-[#666666]">
            Anyone with this link can view and pay this invoice without logging in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={shareUrl}
              className="text-xs bg-slate-50 border-[#DDE2EC] font-mono text-[#017E84] focus-visible:ring-[#017E84]"
            />
            <Button
              onClick={handleCopy}
              className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs px-3 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs border-[#DDE2EC]"
          >
            Close
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleOpenLink}
            className="text-xs border-[#DDE2EC] bg-slate-100 hover:bg-slate-200"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
