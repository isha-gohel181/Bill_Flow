"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Invoice } from "@/types/frontend";
import { Loader2 } from "lucide-react";

interface InvoiceDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onConfirmDelete: (id: string) => Promise<boolean>;
}

export const InvoiceDeleteDialog: React.FC<InvoiceDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  invoice,
  onConfirmDelete,
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!invoice) return null;

  const handleDelete = async () => {
    setDeleting(true);
    const success = await onConfirmDelete(invoice.id);
    setDeleting(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-[#DDE2EC] max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-[#212529]">
            Delete invoice?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-[#666666]">
            Are you sure you want to delete invoice{" "}
            <span className="font-semibold font-mono text-[#017E84]">
              {invoice.invoiceNumber}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 pt-2">
          <AlertDialogCancel disabled={deleting} className="text-xs border-[#DDE2EC]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleting}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-4"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Invoice"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
