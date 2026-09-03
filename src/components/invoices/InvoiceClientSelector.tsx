"use client";

import React from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/frontend";
import { User } from "lucide-react";

interface InvoiceClientSelectorProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  disabled?: boolean;
  error?: string;
}

export const InvoiceClientSelector: React.FC<InvoiceClientSelectorProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  disabled = false,
  error,
}) => {
  if (clients.length === 0 && !disabled) {
    return (
      <div className="p-4 rounded-md border border-amber-200 bg-amber-50/50 text-xs space-y-2">
        <p className="font-semibold text-amber-800">No clients available</p>
        <p className="text-amber-700">
          You must create at least one client contact before creating an invoice.
        </p>
        <Link href="/clients">
          <Button size="sm" className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs mt-1">
            + Create Client
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Select
        value={selectedClientId}
        onValueChange={(val) => onSelectClient(val || "")}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-10 text-xs border-[#DDE2EC] bg-white focus:ring-[#017E84]">
          <div className="flex items-center gap-2 truncate">
            <User className="h-4 w-4 text-[#666666] shrink-0" />
            <SelectValue placeholder="Select a client..." />
          </div>
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id} className="text-xs">
              <span className="font-semibold text-[#212529]">{client.name}</span>
              {client.company && (
                <span className="text-[#666666] ml-2">({client.company})</span>
              )}
              <span className="text-[#017E84] ml-2">• {client.email}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
