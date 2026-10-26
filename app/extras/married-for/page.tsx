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
