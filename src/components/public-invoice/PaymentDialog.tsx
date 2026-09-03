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
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNumber: string;
  amount: number | string;
  currency: string;
  onConfirmPayment: () => Promise<boolean>;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onOpenChange,
  invoiceNumber,
  amount,
  currency,
  onConfirmPayment,
}) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    const success = await onConfirmPayment();
    setProcessing(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#DDE2EC]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#017E84]">
            <CreditCard className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-[#212529]">
              Complete Payment
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#666666]">
            Simulated payment checkout for Invoice{" "}
            <span className="font-semibold font-mono text-[#017E84]">
              {invoiceNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 space-y-4">
          {/* Amount Box */}
          <div className="bg-slate-50 border border-[#DDE2EC] rounded-md p-4 text-center space-y-1">
            <span className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
              Total Due Amount
            </span>
            <div className="text-2xl font-bold text-[#017E84]">
              <CurrencyDisplay amount={amount} currency={currency} />
            </div>
          </div>

          {/* Test Mode Callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-md bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Simulated Payment Mode</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                This is a simulated test payment for demonstration purposes. No real credit card or bank credentials will be charged.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
            className="text-xs border-[#DDE2EC]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4 shadow-xs"
          >
            {processing ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
