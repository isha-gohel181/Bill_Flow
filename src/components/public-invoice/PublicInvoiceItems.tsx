"use client";

import React from "react";
import { Invoice } from "@/types/frontend";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";

interface PublicInvoiceItemsProps {
  invoice: Invoice;
  currency: string;
}

export const PublicInvoiceItems: React.FC<PublicInvoiceItemsProps> = ({
  invoice,
  currency,
}) => {
  return (
    <div className="space-y-6">
      {/* Bill To Info Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="space-y-1.5 bg-slate-50/70 p-4 rounded-md border border-[#DDE2EC]/60">
          <h3 className="font-semibold text-[#666666] uppercase tracking-wider text-[11px]">
            Billed To
          </h3>
          <p className="font-bold text-sm text-[#212529]">
            {invoice.client?.name || "Client Name"}
          </p>
          {invoice.client?.company && (
            <p className="text-[#666666] font-medium">{invoice.client.company}</p>
          )}
          {invoice.client?.email && (
            <p className="text-[#017E84]">{invoice.client.email}</p>
          )}
          {invoice.client?.phone && (
            <p className="text-[#666666]">{invoice.client.phone}</p>
          )}
          {invoice.client?.address && (
            <p className="text-[#666666] whitespace-pre-wrap pt-1 border-t border-[#DDE2EC]/40 mt-1">
              {invoice.client.address}
            </p>
          )}
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto border border-[#DDE2EC] rounded-md">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/80 border-b border-[#DDE2EC] font-semibold text-[#666666]">
            <tr>
              <th className="py-3 px-4">Item Description</th>
              <th className="py-3 px-4 text-center w-24">Qty</th>
              <th className="py-3 px-4 text-right w-32">Rate</th>
              <th className="py-3 px-4 text-right w-36">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE2EC]/60">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3 px-4 font-medium text-[#212529]">
                    {item.description}
                  </td>
                  <td className="py-3 px-4 text-center text-[#666666]">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-[#666666]">
                    <CurrencyDisplay amount={item.rate} currency={currency} />
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-[#212529]">
                    <CurrencyDisplay amount={item.amount || 0} currency={currency} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-[#666666]">
                  No line items attached.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
