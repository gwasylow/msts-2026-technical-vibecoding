import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sansFont = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const monoFont = Space_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MSTSTechVibe.WebApp",
  description: "Next.js frontend for the MSTSTechVibe API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-432ZEE15BK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-432ZEE15BK');
        `}
      </Script>
    </html>
  );
}
