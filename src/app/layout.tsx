import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import ExternalBrowserRedirect from '@/components/ExternalBrowserRedirect'

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
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:6387251,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ExternalBrowserRedirect />
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
