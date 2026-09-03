"use client";

import React from "react";
import { Invoice } from "@/types/frontend";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";

interface PublicInvoiceSummaryProps {
  invoice: Invoice;
  currency: string;
}

export const PublicInvoiceSummary: React.FC<PublicInvoiceSummaryProps> = ({
  invoice,
  currency,
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Breakdown (Authoritative Backend Totals) */}
      <div className="flex flex-col sm:flex-row justify-end text-xs">
        <div className="w-full sm:w-72 space-y-2.5 bg-slate-50/50 p-4 rounded-md border border-[#DDE2EC]">
          <div className="flex justify-between items-center text-[#666666]">
            <span>Subtotal</span>
            <span className="font-semibold text-[#212529]">
              <CurrencyDisplay amount={invoice.subtotal || 0} currency={currency} />
            </span>
          </div>

          {parseFloat(invoice.taxRate || "0") > 0 && (
            <div className="flex justify-between items-center text-[#666666]">
              <span>Tax ({invoice.taxRate}%)</span>
              <span className="font-semibold text-[#212529]">
                +<CurrencyDisplay amount={invoice.taxAmount || 0} currency={currency} />
              </span>
            </div>
          )}

          {parseFloat(invoice.discount || "0") > 0 && (
            <div className="flex justify-between items-center text-emerald-600">
              <span>Discount</span>
              <span className="font-semibold">
                -<CurrencyDisplay amount={invoice.discount || 0} currency={currency} />
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2.5 border-t border-[#DDE2EC] text-sm font-bold text-[#212529]">
            <span>Total Amount</span>
            <span className="text-[#017E84] text-base">
              <CurrencyDisplay amount={invoice.total || 0} currency={currency} />
            </span>
          </div>
        </div>
      </div>

      {/* Notes / Terms Section */}
      {invoice.notes && (
        <div className="pt-4 border-t border-[#DDE2EC] space-y-1.5 text-xs text-[#666666]">
          <h3 className="font-semibold text-[#212529]">Notes & Payment Terms</h3>
          <p className="whitespace-pre-wrap bg-slate-50/50 p-3 rounded-md border border-[#DDE2EC]/60">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
};
