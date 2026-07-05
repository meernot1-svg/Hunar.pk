import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hunar.pk — Pakistani Talent. World-Class Value.",
  description:
    "Pakistan's first local freelancing network. Find kaam or post your services — all in PKR. Logo Design, Website, Video Editing, SEO and more.",
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
    icon: "/hunar-logo.svg",
  },
  openGraph: {
    title: "Hunar.pk — Pakistani Talent. World-Class Value.",
    description:
      "Pakistan's first local freelancing network. Find kaam or post your services — all in PKR.",
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
        className={`${inter.variable} ${sora.variable} antialiased bg-slate-950 text-white selection:bg-green-500/30`}
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
