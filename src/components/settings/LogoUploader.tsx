"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { settingsApi } from "@/lib/api";
import { toast } from "sonner";
import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

interface LogoUploaderProps {
  logoUrl?: string | null;
  onLogoChange: () => void;
  disabled?: boolean;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoUrl,
  onLogoChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file size must be less than 2MB.");
      return;
    }

    setUploading(true);
    try {
      const res = await settingsApi.uploadLogo(file);
      if (!res.success) {
        toast.error(res.error || "Unable to upload logo.");
        return;
      }

      toast.success("Logo uploaded successfully");
      onLogoChange();
    } catch (err: any) {
      toast.error(err.message || "Unable to upload logo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    setRemoving(true);
    try {
      const res = await settingsApi.removeLogo();
      if (!res.success) {
        toast.error(res.error || "Unable to remove logo.");
        return;
      }

      toast.success("Logo removed successfully");
      onLogoChange();
    } catch (err: any) {
      toast.error(err.message || "Unable to remove logo.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-[#212529] block">
        Business Logo
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-md border border-[#DDE2EC] bg-slate-50/50">
        {/* Logo Preview Box */}
        <div className="relative h-16 w-48 rounded border border-[#DDE2EC] bg-white flex items-center justify-center overflow-hidden shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Business Logo"
              fill
              className="object-contain p-1.5"
            />
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <ImageIcon className="h-4 w-4" />
              <span>No Logo Set</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading || removing}
              className="text-xs border-[#DDE2EC] bg-white text-[#212529]"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-3.5 w-3.5 text-[#017E84]" />
                  {logoUrl ? "Change Logo" : "Upload Logo"}
                </>
              )}
            </Button>

            {logoUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveLogo}
                disabled={disabled || uploading || removing}
                className="text-xs border-[#DDE2EC] text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                {removing ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Remove Logo
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-[11px] text-[#666666]">
            Recommended: Transparent PNG or WEBP, max 2MB size.
          </p>
        </div>
      </div>
    </div>
  );
};
