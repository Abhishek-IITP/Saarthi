import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Saarthi — Personal AI that remembers",
  description: "A private personal AI companion that understands what matters to you and helps you decide what to do next.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light">
      <body className="bg-[#FAF9F5] text-[#1F1E1D] antialiased selection:bg-[#D96B27]/15 selection:text-[#9A3412] min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
