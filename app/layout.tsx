import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRAConnect - Marketplace RW 15",
  description: "Marketplace untuk warga RW 15 Candirenggo Asri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm relative pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
