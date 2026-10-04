import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-slate-50 text-slate-900">
      <div className="max-w-md text-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-4xl font-mono font-bold text-slate-300">404</p>
        <h1 className="mt-3 text-lg font-semibold text-slate-900">Page not found</h1>
        <p className="mt-1 text-xs text-slate-500">The requested page does not exist in Saarthi.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to dashboard</span>
        </Link>
      </div>
    </div>
  );
}
