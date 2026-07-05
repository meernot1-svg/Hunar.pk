import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hunar.pk — Pakistani Talent. Duniya Ki Keemat.",
  description:
    "Pakistan ka pehla local freelancing network. Kaam dhundho ya apna kaam post karein — sab kuch PKR mein. Logo Design, Website, Video Editing, SEO aur bohot kuch.",
  keywords: [
    "Hunar.pk",
    "Pakistan freelancing",
    "local freelancing",
    "Kaam",
    "Pakistani talent",
    "logo design Pakistan",
    "freelance Pakistan",
  ],
  authors: [{ name: "Hunar.pk" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Hunar.pk — Pakistani Talent. Duniya Ki Keemat.",
    description:
      "Pakistan ka pehla local freelancing network. Kaam dhundho ya apna kaam post karein — sab kuch PKR mein.",
    siteName: "Hunar.pk",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-slate-950 text-white selection:bg-green-500/30`}
      >
        {children}
        <Toaster />
        <Script
          src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
