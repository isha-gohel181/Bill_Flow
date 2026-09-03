"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  user?: { name?: string; email?: string } | null;
  onLogout?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  user,
  onLogout,
  title,
}) => {
  return (
    <header className="lg:hidden sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[#DDE2EC] bg-white px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#212529]"
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 shrink-0 flex items-center justify-center">
            <img
              src="/logo-v4.png"
              alt="BillFlow Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <span className="font-extrabold text-lg tracking-tight leading-tight">
            <span className="text-[#714B67]">Bill</span>
            <span className="text-[#017E84]">Flow</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
};
