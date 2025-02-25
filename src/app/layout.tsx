import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokerRoom - プライベートポーカールーム予約サイト",
  description: "東京のプライベートポーカールームを簡単に検索・予約できるプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-white pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
