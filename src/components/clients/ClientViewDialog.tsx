"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/frontend";
import { ClientAvatar } from "./ClientAvatar";
import { DateDisplay } from "@/components/shared/DateDisplay";
import { Edit2, Mail, Building, Phone, MapPin, Calendar } from "lucide-react";

interface ClientViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onEdit: (client: Client) => void;
}

export const ClientViewDialog: React.FC<ClientViewDialogProps> = ({
  isOpen,
  onOpenChange,
  client,
  onEdit,
}) => {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#DDE2EC]">
        <DialogHeader className="flex flex-row items-center gap-3">
          <ClientAvatar name={client.name} className="h-10 w-10" />
          <div className="flex flex-col">
            <DialogTitle className="text-base font-bold text-[#212529]">
              {client.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#666666]">
              {client.company || "Individual Client"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-3 border-y border-[#DDE2EC]/60 text-xs">
          <div className="flex items-center gap-2.5 text-[#212529]">
            <Mail className="h-4 w-4 text-[#666666]" />
            <span className="font-semibold w-20">Email:</span>
            <span className="text-[#017E84]">{client.email}</span>
          </div>

          {client.company && (
            <div className="flex items-center gap-2.5 text-[#212529]">
              <Building className="h-4 w-4 text-[#666666]" />
              <span className="font-semibold w-20">Company:</span>
              <span>{client.company}</span>
            </div>
          )}

          {client.phone && (
            <div className="flex items-center gap-2.5 text-[#212529]">
              <Phone className="h-4 w-4 text-[#666666]" />
              <span className="font-semibold w-20">Phone:</span>
              <span>{client.phone}</span>
            </div>
          )}

          {client.address && (
            <div className="flex items-start gap-2.5 text-[#212529]">
              <MapPin className="h-4 w-4 text-[#666666] mt-0.5" />
              <span className="font-semibold w-20">Address:</span>
              <span className="flex-1 whitespace-pre-wrap">{client.address}</span>
            </div>
          )}

          {client.createdAt && (
            <div className="flex items-center gap-2.5 text-[#212529]">
              <Calendar className="h-4 w-4 text-[#666666]" />
              <span className="font-semibold w-20">Added On:</span>
              <DateDisplay date={client.createdAt} />
            </div>
          )}
        </div>

        <DialogFooter className="pt-1 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs border-[#DDE2EC]"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onEdit(client);
            }}
            className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4"
          >
            <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
