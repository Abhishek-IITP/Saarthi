import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#FAF9F5] text-[#1F1E1D]">
      <div className="max-w-md text-center rounded-xl border border-[#E5E3DC] bg-[#FFFFFF] p-8 shadow-sm">
        <p className="text-4xl font-mono font-bold text-[#8C8980]">404</p>
        <h1 className="mt-3 font-serif text-2xl font-normal text-[#1F1E1D]">Page not found</h1>
        <p className="mt-1 text-xs text-[#706E68]">The requested page does not exist in Saarthi.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#D96B27] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C25E1F] transition-colors shadow-sm"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to dashboard</span>
        </Link>
      </div>
    </div>
  );
}
