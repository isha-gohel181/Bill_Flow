"use client";

import React from "react";
import Image from "next/image";
import { Invoice, BusinessSettings } from "@/types/frontend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DateDisplay } from "@/components/shared/DateDisplay";

interface PublicInvoiceHeaderProps {
  invoice: Invoice;
  business?: BusinessSettings;
}

export const PublicInvoiceHeader: React.FC<PublicInvoiceHeaderProps> = ({
  invoice,
  business,
}) => {
  const businessName = business?.businessName || "BillFlow Business";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#DDE2EC] pb-6">
      {/* Business Branding */}
      <div className="space-y-2">
        {business?.logoUrl ? (
          <div className="relative h-12 w-48 max-w-full">
            <Image
              src={business.logoUrl}
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

      {/* Invoice Title & Dates */}
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
  );
};
