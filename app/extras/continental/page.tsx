import { notFound } from "next/navigation";
import { Metadata } from "next";
import ContinentalClient from "./ContinentalClient";

// Flip to true to hide this page (returns 404)
const ARCHIVED = false;

export const metadata: Metadata = {
  title: "Continental",
  robots: { index: false, follow: false },
};

export default function ContinentalPage() {
  if (ARCHIVED) notFound();
  return <ContinentalClient />;
}
