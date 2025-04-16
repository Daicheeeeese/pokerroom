import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'プライベートポーカールーム予約',
    template: '%s | プライベートポーカールーム予約',
  },
  description: "東京のプライベートポーカールームを簡単に検索・予約できるサービスです。",
  keywords: ['ポーカー', 'プライベートポーカールーム', '予約', '東京'],
  openGraph: {
    title: 'プライベートポーカールーム予約',
    description: '東京のプライベートポーカールームを簡単に検索・予約できるサービスです。',
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
    <html lang="ja" className={inter.className}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DR0ZCLKC4T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DR0ZCLKC4T');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <NextAuthProvider>
            <Header />
            <main className="flex-grow bg-white pt-16">
              {children}
            </main>
            <Footer />
          </NextAuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
