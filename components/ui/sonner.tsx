"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      richColors
      toastOptions={{
        style: {
          background: "#FFFFFF",
          border: "1px solid #E5E3DC",
          color: "#1F1E1D",
        },
      }}
    />
  );
}
