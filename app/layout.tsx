import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saarthi — Personal AI that remembers",
  description: "A private personal AI companion that understands what matters to you and helps you decide what to do next.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`light ${plusJakarta.variable} ${newsreader.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-[#FAF9F5] text-[#1F1E1D] font-sans antialiased selection:bg-[#D96B27]/15 selection:text-[#9A3412] min-h-screen" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

