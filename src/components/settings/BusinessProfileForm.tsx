"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUploader } from "./LogoUploader";
import { Building } from "lucide-react";

interface BusinessProfileFormProps {
  businessName: string;
  onBusinessNameChange: (val: string) => void;
  logoUrl?: string | null;
  onLogoChange: () => void;
  disabled?: boolean;
  errors?: Record<string, string>;
}

export const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({
  businessName,
  onBusinessNameChange,
  logoUrl,
  onLogoChange,
  disabled = false,
  errors = {},
}) => {
  return (
    <Card className="bg-white border-[#DDE2EC] shadow-xs">
      <CardHeader className="pb-3 border-b border-[#DDE2EC]/60">
        <CardTitle className="text-sm font-semibold text-[#212529] flex items-center gap-2">
          <Building className="h-4 w-4 text-[#017E84]" />
          Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {/* Business Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="business-name" className="text-xs font-semibold text-[#212529]">
            Business Name <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="business-name"
            placeholder="Acme Solutions LLC"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            disabled={disabled}
            className="text-xs bg-white border-[#DDE2EC] focus-visible:ring-[#017E84]"
          />
          {errors.businessName && (
            <p className="text-xs text-rose-500 font-medium">{errors.businessName}</p>
          )}
        </div>

        {/* Logo Uploader */}
        <LogoUploader
          logoUrl={logoUrl}
          onLogoChange={onLogoChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
