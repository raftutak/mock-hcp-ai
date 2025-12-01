import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TopBar } from "@/components/landing/top-bar";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roche Hub - Healthcare Professional Portal",
  description:
    "RocheHub is an educational resource for healthcare professionals with modern interface and comprehensive trial data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://cdns.gigya.com/js/gigya.js?apikey=4_OcxovepoWrve9tzUBga7bw&lang=en"
        strategy="afterInteractive"
        id="gigya-script"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <TopBar />
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
