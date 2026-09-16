import { Metadata } from "next";
import { metaData } from "@/app/config";

export const metadata: Metadata = {
  title: "Gift Shop",
  description: "Gift shop for the Museum of Dashes project.",
  alternates: {
    canonical: `${metaData.baseUrl}work/museum-of-dashes/giftshop`,
  },
};

export default function GiftShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
