"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client } from "@/types/frontend";
import { Search, X, ArrowUpDown, Filter } from "lucide-react";

interface InvoiceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string | null) => void;
  clientId: string;
  onClientChange: (val: string | null) => void;
  sortBy: string;
  onSortByChange: (val: string | null) => void;
  sortOrder: "asc" | "desc";
  onSortOrderToggle: () => void;
  clients: Client[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  clientId,
  onClientChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  clients,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-md border border-[#DDE2EC] shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#666666]" />
          <Input
            placeholder="Search by invoice #, client name, email, company..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84] h-9"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[130px] h-9 text-xs border-[#DDE2EC] bg-white">
              <div className="flex items-center gap-1.5 truncate">
                <Filter className="h-3.5 w-3.5 text-[#666666]" />
                <SelectValue placeholder="All Statuses" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="draft" className="text-xs">Draft</SelectItem>
              <SelectItem value="sent" className="text-xs">Sent</SelectItem>
              <SelectItem value="paid" className="text-xs">Paid</SelectItem>
              <SelectItem value="overdue" className="text-xs">Overdue</SelectItem>
            </SelectContent>
          </Select>

          {/* Client Filter */}
          <Select value={clientId} onValueChange={onClientChange}>
            <SelectTrigger className="w-[150px] h-9 text-xs border-[#DDE2EC] bg-white">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Clients</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By Dropdown */}
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[140px] h-9 text-xs border-[#DDE2EC] bg-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt" className="text-xs">Created Date</SelectItem>
              <SelectItem value="issueDate" className="text-xs">Issue Date</SelectItem>
              <SelectItem value="dueDate" className="text-xs">Due Date</SelectItem>
              <SelectItem value="invoiceNumber" className="text-xs">Invoice Number</SelectItem>
              <SelectItem value="total" className="text-xs">Total Amount</SelectItem>
              <SelectItem value="status" className="text-xs">Status</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSortOrderToggle}
            className="h-9 px-2.5 text-xs border-[#DDE2EC] bg-white hover:bg-slate-50 text-[#666666]"
            title={`Sort Order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
            {sortOrder.toUpperCase()}
          </Button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
