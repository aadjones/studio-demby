import { Metadata } from "next";
import { metaData } from "@/app/config";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Aaron Demby Jones — music, visual art, teaching, or anything else.",
  openGraph: {
    title: "Contact | Studio Demby",
    description: "Get in touch with Aaron Demby Jones.",
    url: `${metaData.baseUrl}contact`,
    siteName: metaData.name,
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2">Get in touch</h1>
      <ContactForm />
    </div>
  );
}
