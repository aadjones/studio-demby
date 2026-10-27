import { notFound } from "next/navigation";
import { Metadata } from "next";
import MarriedForClient from "./MarriedForClient";

// Flip to true to hide this page (returns 404)
const ARCHIVED = false;

const description =
  "Aaron & Anakaren got married on October 24, 2026. Follow the time since in your preferred timekeeping system.";

export const metadata: Metadata = {
  title: "Married For",
  description,
  robots: { index: false, follow: false },
  // The wedding rings from the old save-the-date site, in place of the Studio Demby icon
  icons: {
    icon: [
      { url: "/images/married-for/favicon.svg", type: "image/svg+xml" },
      { url: "/images/married-for/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/married-for/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/married-for/favicon.ico", sizes: "48x48" },
    ],
    apple: "/images/married-for/apple-touch-icon.png",
  },
  openGraph: {
    title: "Married For",
    description,
    images: "/images/married-for/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Married For",
    description,
    images: "/images/married-for/og-image.jpg",
  },
};

export default function MarriedForPage() {
  if (ARCHIVED) notFound();
  return <MarriedForClient />;
}
