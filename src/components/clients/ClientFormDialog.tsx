"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/types/frontend";
import { Loader2 } from "lucide-react";

interface ClientFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientToEdit?: Client | null;
  onSubmit: (data: Partial<Client>) => Promise<boolean>;
}

export const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  isOpen,
  onOpenChange,
  clientToEdit,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name || "");
      setEmail(clientToEdit.email || "");
      setCompany(clientToEdit.company || "");
      setPhone(clientToEdit.phone || "");
      setAddress(clientToEdit.address || "");
    } else {
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setAddress("");
    }
    setErrors({});
  }, [clientToEdit, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = "Client name is required";
    }
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const success = await onSubmit({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
    });
    setSubmitting(false);

    if (success) {
      onOpenChange(false);
    }
  };

  const isEditing = !!clientToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#DDE2EC]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#212529]">
            {isEditing ? "Edit Client" : "Create New Client"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#666666]">
            {isEditing
              ? "Update client billing information and contact details."
              : "Add a new client to manage billing and generate invoices."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="client-name" className="text-xs font-semibold text-[#212529]">
              Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="client-name"
              placeholder="Acme Corporation or John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="text-sm bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
            />
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="client-email" className="text-xs font-semibold text-[#212529]">
              Email Address <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="client-email"
              type="email"
              placeholder="billing@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="text-sm bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
            />
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Company & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="client-company" className="text-xs font-semibold text-[#212529]">
                Company (Optional)
              </Label>
              <Input
                id="client-company"
                placeholder="Acme Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={submitting}
                className="text-sm bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-phone" className="text-xs font-semibold text-[#212529]">
                Phone (Optional)
              </Label>
              <Input
                id="client-phone"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={submitting}
                className="text-sm bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
              />
            </div>
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <Label htmlFor="client-address" className="text-xs font-semibold text-[#212529]">
              Address (Optional)
            </Label>
            <Textarea
              id="client-address"
              placeholder="123 Business Rd, Suite 100, New York, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={submitting}
              rows={2}
              className="text-sm bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="text-xs border-[#DDE2EC]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  {isEditing ? "Saving..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
