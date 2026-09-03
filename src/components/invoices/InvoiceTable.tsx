"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/frontend";
import { ClientAvatar } from "@/components/clients/ClientAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { DateDisplay } from "@/components/shared/DateDisplay";
import { Eye, Edit2, Trash2 } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  currency?: string;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  currency = "INR",
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-[#DDE2EC] rounded-md shadow-xs overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#DDE2EC] hover:bg-transparent bg-slate-50/50">
              <TableHead className="font-semibold text-xs text-[#666666]">Invoice</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Client</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Issue Date</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Due Date</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666] text-right">Amount</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666] text-center">Status</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow
                key={inv.id}
                className="hover:bg-slate-50/80 border-b border-[#DDE2EC]/60 transition-colors"
              >
                <TableCell className="py-3 font-mono text-xs font-semibold text-[#017E84]">
                  {inv.invoiceNumber}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2.5">
                    <ClientAvatar name={inv.client?.name || "Client"} />
                    <span className="font-semibold text-xs text-[#212529]">
                      {inv.client?.name || "Client"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  <DateDisplay date={inv.issueDate} />
                </TableCell>
                <TableCell className="text-xs">
                  <DateDisplay date={inv.dueDate} />
                </TableCell>
                <TableCell className="text-xs text-right font-semibold text-[#212529]">
                  <CurrencyDisplay amount={inv.total} currency={currency} />
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-right py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(inv)}
                      className="h-7 w-7 text-slate-500 hover:text-[#017E84] hover:bg-teal-50"
                      title="View invoice details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(inv)}
                      className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Edit invoice"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(inv)}
                      className="h-7 w-7 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete invoice"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-[#DDE2EC]">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#017E84]">
                {inv.invoiceNumber}
              </span>
              <StatusBadge status={inv.status} />
            </div>

            <div className="flex items-center justify-between text-xs text-[#212529]">
              <div className="flex items-center gap-2">
                <ClientAvatar name={inv.client?.name || "Client"} className="h-6 w-6" />
                <span className="font-medium">{inv.client?.name || "Client"}</span>
              </div>
              <span className="font-bold">
                <CurrencyDisplay amount={inv.total} currency={currency} />
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#666666] pt-1">
              <span>Due: <DateDisplay date={inv.dueDate} /></span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(inv)}
                  className="h-7 w-7 text-slate-500"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(inv)}
                  className="h-7 w-7 text-slate-500"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(inv)}
                  className="h-7 w-7 text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
