import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'ポーカールーム予約',
    template: '%s | ポーカールーム予約',
  },
  description: "東京のポーカールームを簡単に検索・予約できるサービスです。",
  keywords: ['ポーカー', 'ポーカールーム', '予約', '東京'],
  openGraph: {
    title: 'ポーカールーム予約',
    description: '東京のポーカールームを簡単に検索・予約できるサービスです。',
    type: 'website',
    locale: 'ja_JP',
  },
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
