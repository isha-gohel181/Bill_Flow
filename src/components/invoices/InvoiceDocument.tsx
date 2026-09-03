"use client";

import React from "react";
import Image from "next/image";
import { Invoice, BusinessSettings } from "@/types/frontend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { DateDisplay } from "@/components/shared/DateDisplay";

interface InvoiceDocumentProps {
  invoice: Invoice;
  settings?: BusinessSettings | null;
}

export const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  invoice,
  settings,
}) => {
  const currency = settings?.currency || "INR";
  const businessName = settings?.businessName || "BillFlow Workspace";

  return (
    <div
      id="invoice-document"
      className="bg-white border border-[#DDE2EC] rounded-md shadow-xs p-6 sm:p-8 max-w-4xl mx-auto space-y-8 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none"
    >
      {/* Document Header: Business Logo/Name + Invoice Title & Dates */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#DDE2EC] pb-6">
        <div className="space-y-2">
          {settings?.logoUrl ? (
            <div className="relative h-12 w-48 max-w-full">
              <Image
                src={settings.logoUrl}
                alt={businessName}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          ) : (
            <h2 className="text-xl font-bold tracking-tight text-[#714B67]">
              {businessName}
            </h2>
          )}
        </div>

        <div className="text-left sm:text-right space-y-1.5">
          <div className="flex items-center sm:justify-end gap-2.5">
            <h1 className="text-xl font-mono font-bold text-[#017E84]">
              {invoice.invoiceNumber}
            </h1>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="text-xs text-[#666666] space-y-0.5">
            <p>
              <span className="font-medium text-[#212529]">Issued:</span>{" "}
              <DateDisplay date={invoice.issueDate} />
            </p>
            <p>
              <span className="font-medium text-[#212529]">Due Date:</span>{" "}
              <DateDisplay date={invoice.dueDate} />
            </p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
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
          <h3 className="font-semibold text-[#212529]">Notes & Terms</h3>
          <p className="whitespace-pre-wrap bg-slate-50/50 p-3 rounded-md border border-[#DDE2EC]/60">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
};
