import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelFi",
  description: "Autonomous DeFi agent for Solana with built-in x402 security checks."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
