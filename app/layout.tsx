import "./global.css";
import type { Metadata } from "next";
import { Outfit, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import { metaData } from "./config";
import "katex/dist/katex.min.css";
import PageLayout from "./components/layout/PageLayout";

// Display font for headings - geometric, playful, distinctive
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body font - editorial elegance with warmth
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Monospace for code - distinctive and intentional
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: metaData.name,
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/feed.xml"
          title="RSS Feed"
        />
        <script src="/p5.min.js" defer />
      </head>
      <body className="antialiased font-body">
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
