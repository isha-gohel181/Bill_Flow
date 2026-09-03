import React from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="text-sm text-slate-500">
          Configure business details, logo, currency, and invoice numbering prefix.
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5 text-indigo-600" />
            Business Profile & Defaults
          </CardTitle>
          <CardDescription>
            Configure defaults for your invoices and business branding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Settings interface controls will be implemented in Phase 14.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
