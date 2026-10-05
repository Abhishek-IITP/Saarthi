import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Saarthi — Personal AI that remembers",
  description: "A private personal AI companion that understands what matters to you and helps you decide what to do next.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400..600;1,400..600&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400..600&family=Plus+Jakarta+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF9F5] text-[#1F1E1D] font-sans antialiased selection:bg-[#D96B27]/15 selection:text-[#9A3412] min-h-screen" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}


