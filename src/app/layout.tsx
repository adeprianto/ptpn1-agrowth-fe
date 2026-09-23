import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "cn";
import { AuthProvider } from "@/features/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SI Pengembangan SDM | PTPN1",
  description: "Sistem Informasi Pengembangan SDM PTPN1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn(
        // variabel font
        geistSans.variable,
        geistMono.variable,
        // tampilan
        "h-full antialiased",
      )}
    >
      <body className="h-full bg-slate-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
