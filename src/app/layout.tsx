import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProxLLM - Your Gateway to AI",
  description: "A web-based LLM chat platform with support for multiple AI providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
