import "./global.css";
import type { Metadata } from "next";
import { Outfit, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-touch-icon.png",
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
        <script src="/p5.min.js" defer />
      </head>
      <body className="antialiased font-body">
        <script
          type="application/ld+json"
          id="person-schema"
        >{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Aaron Demby Jones",
          alternateName: "Studio Demby",
          url: "https://www.studiodemby.com",
          email: "mailto:aaron.demby.jones@gmail.com",
          jobTitle: ["Musician", "Visual Artist", "Educator", "Creative Coder"],
          alumniOf: [
            { "@type": "CollegeOrUniversity", name: "UC Santa Barbara" },
            { "@type": "CollegeOrUniversity", name: "Brown University" },
          ],
          sameAs: [
            "https://soundcloud.com/aaron-demby-jones",
            "https://github.com/aadjones",
            "https://www.instagram.com/studio_demby",
            "https://www.youtube.com/@studiodemby",
            "https://www.linkedin.com/in/aaron-jones-3716431b7/",
          ],
        })}</script>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
