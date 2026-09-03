"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Receipt } from "lucide-react";
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
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-white font-bold">
            <Receipt className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
            BillFlow
          </span>
        </div>
        {title && (
          <h1 className="hidden sm:block text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
};
