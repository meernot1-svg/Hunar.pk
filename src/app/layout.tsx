import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://hunar.pk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hunar.pk — Pakistan's Biggest Local Freelancing Network",
    template: "%s | Hunar.pk",
  },
  description:
    "Hunar.pk is Pakistan's biggest local freelancing network. Hire talented workers or post your kaam — logo design, website development, video editing, SEO, content writing & more. Chat on WhatsApp, pay in PKR, zero commission.",
  applicationName: "Hunar.pk",
  keywords: [
    "Hunar.pk",
    "Pakistan freelancing",
    "Pakistan biggest freelancing network",
    "local freelancing Pakistan",
    "freelance Pakistan",
    "hire Pakistani workers",
    "Pakistani talent",
    "logo design Pakistan",
    "website development Pakistan",
    "video editing Pakistan",
    "SEO services Pakistan",
    "content writing Urdu",
    "social media management Pakistan",
    "app development Pakistan",
    "photography Pakistan",
    "Kaam",
    "freelance marketplace Pakistan",
    "WhatsApp freelancing Pakistan",
    "PKR freelancing",
  ],
  authors: [{ name: "Hunar.pk", url: SITE_URL }],
  creator: "Hunar.pk",
  publisher: "Hunar.pk",
  category: "Business",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/hunar-logo.svg", type: "image/svg+xml" },
    ],
    apple: "/hunar-logo.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Hunar.pk — Pakistan's Biggest Local Freelancing Network",
    description:
      "Hire talented Pakistani workers or post your kaam — logo design, website, video editing, SEO & more. Chat on WhatsApp, pay in PKR, zero commission.",
    url: SITE_URL,
    siteName: "Hunar.pk",
    type: "website",
    locale: "en_PK",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hunar.pk — Pakistan's Biggest Local Freelancing Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunar.pk — Pakistan's Biggest Local Freelancing Network",
    description:
      "Hire talented Pakistani workers or post your kaam. Chat on WhatsApp, pay in PKR, zero commission.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

/* JSON-LD structured data for SEO */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hunar.pk",
  alternateName: "Hunar PK",
  url: SITE_URL,
  logo: `${SITE_URL}/hunar-logo.svg`,
  description:
    "Pakistan's biggest local freelancing network. Hire workers or post kaam — all in PKR.",
  foundingDate: "2024",
  areaServed: {
    "@type": "Country",
    name: "Pakistan",
  },
  knowsLanguage: ["en", "ur"],
  sameAs: [
    "https://www.facebook.com/hunarpk",
    "https://www.instagram.com/hunarpk",
    "https://twitter.com/hunarpk",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hunar.pk",
  url: SITE_URL,
  description:
    "Pakistan's biggest local freelancing network. Find kaam or post your services in PKR.",
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hunar.pk Freelancing Marketplace",
  serviceType: "Freelancing Services",
  provider: {
    "@type": "Organization",
    name: "Hunar.pk",
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Country",
    name: "Pakistan",
  },
  description:
    "Pakistan's biggest local freelancing network offering logo design, website development, video editing, SEO, content writing, social media management, app development and photography services. Connect with workers directly on WhatsApp and pay in PKR.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "PKR",
    lowPrice: "1500",
    highPrice: "45000",
    offerCount: "45000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
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
