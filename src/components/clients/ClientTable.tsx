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
import { Client } from "@/types/frontend";
import { ClientAvatar } from "./ClientAvatar";
import { DateDisplay } from "@/components/shared/DateDisplay";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ClientTableProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
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
              <TableHead className="font-semibold text-xs text-[#666666] w-64">Client</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Company</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Email</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Phone</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666]">Created</TableHead>
              <TableHead className="font-semibold text-xs text-[#666666] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="hover:bg-slate-50/80 border-b border-[#DDE2EC]/60 transition-colors"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <ClientAvatar name={client.name} />
                    <span className="font-semibold text-xs text-[#212529]">
                      {client.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-[#212529]">
                  {client.company || <span className="text-[#666666]">-</span>}
                </TableCell>
                <TableCell className="text-xs text-[#017E84] font-medium">
                  {client.email}
                </TableCell>
                <TableCell className="text-xs text-[#666666]">
                  {client.phone || "-"}
                </TableCell>
                <TableCell className="text-xs">
                  <DateDisplay date={client.createdAt || ""} />
                </TableCell>
                <TableCell className="text-right py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(client)}
                          className="h-7 w-7 text-slate-500 hover:text-[#017E84] hover:bg-teal-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View details</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(client)}
                          className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit client</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(client)}
                          className="h-7 w-7 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete client</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden divide-y divide-[#DDE2EC]">
        {clients.map((client) => (
          <div key={client.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ClientAvatar name={client.name} />
                <span className="font-semibold text-sm text-[#212529]">
                  {client.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(client)}
                  className="h-8 w-8 text-slate-500"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(client)}
                  className="h-8 w-8 text-slate-500"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(client)}
                  className="h-8 w-8 text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-xs space-y-1 pl-10 text-[#666666]">
              <p className="text-[#017E84] font-medium">{client.email}</p>
              {client.company && <p>Company: {client.company}</p>}
              {client.phone && <p>Phone: {client.phone}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
