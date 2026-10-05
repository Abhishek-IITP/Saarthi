"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CheckCircle2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { apiCheckHealth } from "@/lib/saarthi";

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 group">
      <span className="text-[#D96B27] font-serif text-lg transition-transform group-hover:scale-110">✦</span>
      <span className="font-serif text-xl font-medium tracking-tight text-[#1F1E1D]">Saarthi</span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8980] bg-[#F3F1EC] border border-[#E5E3DC] px-1.5 py-0.5 rounded">
        local
      </span>
    </Link>
  );
}

export function LocalAIStatus() {
  const [health, setHealth] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const fetchStatus = async () => {
    setChecking(true);
    try {
      const data = await apiCheckHealth();
      setHealth(data);
    } catch {
      // offline fallback
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  const isOllamaOnline = health?.ollama?.online;
  const isMongoConnected = health?.mongodb?.connected;

  const rows = [
    ["Model", health?.model || "Gemma 3 (4B)"],
    ["Runtime", "Ollama"],
    ["Inference", "Local device"],
    ["Cloud AI", "Not used (0 API fees)"],
    ["MongoDB", isMongoConnected ? "Connected" : "Local fallback"],
  ];

  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2 rounded-md border border-[#E5E3DC] bg-[#FFFFFF] px-2.5 py-1 text-xs text-[#706E68] hover:text-[#1F1E1D] hover:border-[#D1CEBE] transition-all shadow-sm">
        <span className="relative flex size-2">
          {isOllamaOnline ? (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-40" />
              <span className="relative size-2 rounded-full bg-emerald-600" />
            </>
          ) : (
            <span className="relative size-2 rounded-full bg-amber-500" />
          )}
        </span>
        <span className="font-medium text-[#1F1E1D]">
          {isOllamaOnline ? "Gemma 3 Active" : "Local AI"}
        </span>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border hidden sm:inline ${
          isOllamaOnline 
            ? "text-emerald-800 bg-emerald-50 border-emerald-200" 
            : "text-amber-800 bg-amber-50 border-amber-200"
        }`}>
          {isOllamaOnline ? "online" : "checking"}
        </span>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 rounded-lg border border-[#E5E3DC] bg-[#FFFFFF] p-4 shadow-md text-[#1F1E1D]">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E3DC]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#706E68] flex items-center gap-1.5">
            <span className="text-[#D96B27]">✦</span> Local AI Runtime
          </p>
          <button
            onClick={fetchStatus}
            disabled={checking}
            aria-label="Refresh Status"
            className="text-[#706E68] hover:text-[#1F1E1D] text-xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`size-3 ${checking ? "animate-spin" : ""}`} />
          </button>
        </div>

        <dl className="mt-3 space-y-2.5 text-xs">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between items-center">
              <dt className="text-[#706E68]">{k}</dt>
              <dd className="font-medium text-[#1F1E1D] flex items-center gap-1">
                {k === "Model" && <CheckCircle2 className="size-3 text-emerald-600" />}
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 border-t border-[#E5E3DC] pt-2.5 text-[11px] text-[#8C8980] leading-relaxed">
          Inference runs locally on this device. Your personal context never leaves your computer.
        </div>
      </PopoverContent>
    </Popover>
  );
}

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/memories", label: "Memories" },
  { href: "/ask", label: "Ask Saarthi" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E3DC] bg-[#FAF9F5]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#EFECE6] text-[#1F1E1D]"
                    : "text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F5F3EC]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <LocalAIStatus />
        </div>

        <button
          className="md:hidden text-[#706E68] hover:text-[#1F1E1D]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#E5E3DC] bg-[#FAF9F5] px-5 py-3 md:hidden space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-[#706E68] hover:text-[#1F1E1D] hover:bg-[#F3F1EC]"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 pt-2 border-t border-[#E5E3DC]">
            <LocalAIStatus />
          </div>
        </div>
      )}
    </header>
  );
}
