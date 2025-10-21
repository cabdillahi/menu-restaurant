import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "./context/cart-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "menu app | hornsolution",
  description: "hornsolution menu app",
  generator: "hornsolutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
