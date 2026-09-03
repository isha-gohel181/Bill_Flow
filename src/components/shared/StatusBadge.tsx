import React from "react";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/types/frontend";

interface StatusBadgeProps {
  status: InvoiceStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const normalizedStatus = status.toLowerCase() as InvoiceStatus;

  switch (normalizedStatus) {
    case "paid":
      return (
        <Badge
          className={`bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25 font-medium ${className}`}
          variant="outline"
        >
          ● Paid
        </Badge>
      );
    case "sent":
      return (
        <Badge
          className={`bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/25 font-medium ${className}`}
          variant="outline"
        >
          ● Sent
        </Badge>
      );
    case "overdue":
      return (
        <Badge
          className={`bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/25 font-medium ${className}`}
          variant="outline"
        >
          ● Overdue
        </Badge>
      );
    case "draft":
    default:
      return (
        <Badge
          className={`bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/25 font-medium ${className}`}
          variant="outline"
        >
          ● Draft
        </Badge>
      );
  }
};
