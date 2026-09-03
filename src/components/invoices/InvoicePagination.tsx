"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/types/frontend";

interface InvoicePaginationProps {
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const InvoicePagination: React.FC<InvoicePaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, limit, total, totalPages } = pagination;

  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-4 py-3 border border-[#DDE2EC] rounded-md shadow-xs text-xs text-[#666666]">
      <div>
        Showing <span className="font-semibold text-[#212529]">{start}</span>–
        <span className="font-semibold text-[#212529]">{end}</span> of{" "}
        <span className="font-semibold text-[#212529]">{total}</span> invoices
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 px-2.5 text-xs border-[#DDE2EC]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="px-2 font-medium text-[#212529]">
          Page {page} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 px-2.5 text-xs border-[#DDE2EC]"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
