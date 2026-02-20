"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="pt-4 pb-2">
      <div className="flex items-center justify-center gap-6">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-[15px] font-body px-2 py-1 rounded-md transition-colors ${
                isActive
                  ? "font-semibold text-ink-900 underline"
                  : "text-ink-500 hover:text-ink-800"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
