import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Globe, CheckCircle2, Building2, Layers, FileText, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FBFD] text-[#212529] flex flex-col font-sans relative">
      {/* Ambient Decorative Background Watermarks with B1.png */}
      <div className="fixed -top-16 -right-16 w-[450px] h-[450px] opacity-[0.12] pointer-events-none z-0 select-none">
        <img src="/B1.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="fixed top-1/2 -left-20 w-[350px] h-[350px] opacity-[0.08] pointer-events-none z-0 select-none hidden md:block">
        <img src="/B1.png" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Navigation Header */}
      <header className="border-b border-[#DDE2EC] bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-12 w-12 shrink-0 flex items-center justify-center">
              <img
                src="/logo-v4.png"
                alt="BillFlow Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">
              <span className="text-[#714B67]">Bill</span>
              <span className="text-[#017E84]">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-xs font-medium text-[#666666] hover:text-[#212529] hover:bg-slate-100">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#017E84] hover:bg-[#01686D] text-white text-xs font-medium px-4 shadow-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Ambient Background */}
      <section className="relative z-10 overflow-hidden flex-1 flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24">
        {/* Ambient Subtle Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#017E84]/15 to-[#714B67]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none -z-20" />

        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#212529] tracking-tight leading-tight">
            Professional Invoicing & Payment Tracking Made Simple
          </h1>

          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Create custom invoices, manage clients, track income analytics, share direct payment links, and get paid faster with BillFlow.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="bg-[#017E84] hover:bg-[#01686D] text-white px-6 h-11 text-xs font-semibold shadow-md transition-all hover:shadow-lg">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-[#DDE2EC] text-[#212529] bg-white hover:bg-slate-50 h-11 px-6 text-xs font-semibold shadow-xs">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="pt-8 max-w-5xl mx-auto w-full">
            <div className="bg-white border border-[#DDE2EC] rounded-xl shadow-2xl overflow-hidden relative group">
              {/* Computer Window Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  <span className="text-xs font-semibold text-slate-500 ml-2 font-mono">BillFlow Dashboard</span>
                </div>
              </div>
              
              {/* Computer Screen Image Display */}
              <div className="relative bg-slate-100 overflow-hidden">
                <img
                  src="/dashboard.png"
                  alt="BillFlow Dashboard Preview"
                  className="w-full h-auto object-cover object-top block transition-transform duration-500 hover:scale-[1.005]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-10 py-20 bg-white/80 backdrop-blur-xs border-t border-[#DDE2EC] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#212529] tracking-tight">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              A complete invoicing system built for clarity, speed, and accounting compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#017E84]/40 shadow-xs hover:shadow-md hover:border-[#017E84] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#017E84] text-white flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#01686D] transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#212529] tracking-tight">
                  Built for Freelancers & Businesses
                </h3>
                <p className="mt-3 text-sm text-[#666666] leading-relaxed">
                  BillFlow aligns seamlessly with modern business workflows, providing structured invoice generation, client management, and automated calculations.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#017E84]/40 shadow-xs hover:shadow-md hover:border-[#017E84] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#017E84] text-white flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#01686D] transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#212529] tracking-tight">
                  Scalable and Modular
                </h3>
                <p className="mt-3 text-sm text-[#666666] leading-relaxed">
                  Manage multiple clients, flexible line items, custom currencies, and customizable tax rates across all your billing projects.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#017E84]/40 shadow-xs hover:shadow-md hover:border-[#017E84] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#017E84] text-white flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#01686D] transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#212529] tracking-tight">
                  Structured Invoice Outputs
                </h3>
                <p className="mt-3 text-sm text-[#666666] leading-relaxed">
                  Generate clean, auditable PDF exports and public shareable invoice links ready for instant client viewing and direct payments.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#017E84]/40 shadow-xs hover:shadow-md hover:border-[#017E84] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#017E84] text-white flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#01686D] transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#212529] tracking-tight">
                  Real-Time Decisioning & Analytics
                </h3>
                <p className="mt-3 text-sm text-[#666666] leading-relaxed">
                  Evaluate revenue metrics, track paid vs overdue statuses in seconds, and stay in total control of your business income logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="relative z-10 py-12 bg-[#F9FBFD]/70 backdrop-blur-xs border-t border-[#DDE2EC] px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white/90 border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Multi-Currency Support (INR, USD, EUR, GBP, AUD, CAD)</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white/90 border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Customizable Business Logo & Invoice Prefixes</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white/90 border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Browser Print & PDF Document Export</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-md bg-white/90 border border-[#DDE2EC]">
            <CheckCircle2 className="h-4 w-4 text-[#017E84] shrink-0" />
            <span className="font-medium text-[#212529]">Paid Invoice Protection & Dynamic Overdue Resolution</span>
          </div>
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#017E84] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Background Texture & Watermark */}
            <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute right-[-40px] bottom-[-40px] w-80 h-80 opacity-10 pointer-events-none">
              <img src="/B1.png" alt="" className="w-full h-full object-contain invert brightness-200" />
            </div>

            {/* Left Content */}
            <div className="relative z-10 max-w-xl space-y-4 text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-md bg-white/20 text-white font-mono text-[11px] uppercase tracking-wider font-semibold">
                GET STARTED
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to streamline your billing process?
              </h2>
            </div>

            {/* Right Content & Graphic Card */}
            <div className="relative z-10 w-full lg:w-auto max-w-md space-y-4">
              {/* Graphic Mockup Box */}
              <div className="bg-[#EBF7F7] rounded-2xl p-4 sm:p-5 border border-white/30 shadow-lg text-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-teal-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <img src="/logo-v4.png" alt="BillFlow" className="h-6 w-6 object-contain" />
                    <span className="font-extrabold text-xs text-[#017E84]">BillFlow Invoice</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">READY</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 w-28 bg-slate-300 rounded" />
                  <div className="h-2 w-44 bg-slate-200 rounded" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                  <span className="text-xs font-mono font-bold text-slate-700">Total: ₹45,000.00</span>
                  <div className="h-6 px-3 bg-[#017E84] text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    Pay Now <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
                Join BillFlow today and manage your clients, track income analytics, and send custom invoices effortlessly.
              </p>

              {/* Action Buttons using Theme Colors */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/signup">
                  <Button size="lg" className="bg-white hover:bg-teal-50 text-[#017E84] font-bold text-xs px-6 h-11 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border-none">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-6 h-11 border border-white/30 backdrop-blur-xs shadow-xs transition-all">
                    Sign In to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styled Multi-Column Footer */}
      <footer className="relative z-10 border-t border-[#DDE2EC] bg-white/90 backdrop-blur-md pt-16 pb-8 px-4 sm:px-6 lg:px-8 text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <img src="/logo-v4.png" alt="BillFlow Logo" className="h-9 w-9 object-contain" />
                <span className="font-extrabold text-xl tracking-tight">
                  <span className="text-[#714B67]">Bill</span>
                  <span className="text-[#017E84]">Flow</span>
                </span>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed">
                Professional invoicing, payment tracking, client management, and real-time revenue analytics built for clarity and speed.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#212529] uppercase tracking-wider text-[11px]">Product & Features</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/dashboard" className="hover:text-[#017E84] transition-colors">Real-Time Analytics</Link></li>
                <li><Link href="/invoices" className="hover:text-[#017E84] transition-colors">Invoice Management</Link></li>
                <li><Link href="/clients" className="hover:text-[#017E84] transition-colors">Client Database</Link></li>
                <li><Link href="/settings" className="hover:text-[#017E84] transition-colors">Multi-Currency & Tax</Link></li>
              </ul>
            </div>

            {/* Quick Access Column */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#212529] uppercase tracking-wider text-[11px]">Account Access</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/signup" className="hover:text-[#017E84] transition-colors">Get Started Free</Link></li>
                <li><Link href="/login" className="hover:text-[#017E84] transition-colors">Sign In to Dashboard</Link></li>
                <li><Link href="/invoices/new" className="hover:text-[#017E84] transition-colors">Create New Invoice</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[#666666]">
            <p>© {new Date().getFullYear()} BillFlow Invoicing System. All rights reserved.</p>
            <p className="text-[11px]">Built with Next.js & TailwindCSS for BillFlow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
