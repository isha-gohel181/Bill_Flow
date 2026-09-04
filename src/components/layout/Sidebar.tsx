"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Receipt,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user?: { name?: string; email?: string } | null;
  onLogout?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const pathname = usePathname();

  const getInitials = (name?: string) => {
    if (!name) return "BF";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 bg-white border-r border-[#DDE2EC]">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-1.5 px-5 border-b border-[#DDE2EC]">
        <div className="h-10 w-10 shrink-0 flex items-center justify-center">
          <img
            src="/logo-v4.png"
            alt="BillFlow Logo"
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-extrabold text-xl leading-tight tracking-tight">
            <span className="text-[#714B67]">Bill</span>
            <span className="text-[#017E84]">Flow</span>
          </span>
          <span className="text-[11px] text-[#666666] font-medium leading-none mt-0.5">
            Invoicing System
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs transition-colors ${
                isActive
                  ? "bg-slate-100 text-[#017E84] font-semibold border-l-4 border-[#017E84]"
                  : "text-[#666666] hover:bg-slate-50 hover:text-[#212529] font-medium"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#017E84]" : "text-[#666666]"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#DDE2EC] bg-slate-50/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 border border-[#DDE2EC]">
              <AvatarFallback className="bg-[#714B67] text-white font-semibold text-xs">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#212529] truncate">
                {user?.name || "User"}
              </span>
              <span className="text-[11px] text-[#666666] truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          {onLogout && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-8 w-8 text-[#666666] hover:text-rose-600 hover:bg-rose-50"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
