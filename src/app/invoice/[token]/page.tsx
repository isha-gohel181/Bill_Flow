import React from "react";
import { Receipt } from "lucide-react";

interface PublicInvoicePageProps {
  params: Promise<{ token: string }>;
}

export default async function PublicInvoicePage({ params }: PublicInvoicePageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-slate-800 bg-slate-900">
        <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold mx-auto shadow-lg shadow-indigo-600/30">
          <Receipt className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Public Invoice</h1>
        <p className="text-sm text-slate-400">
          Public invoice token: <span className="font-mono text-indigo-400">{token}</span>
        </p>
      </div>
    </div>
  );
}
