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
  const isContactActive = pathname.startsWith("/contact");

  return (
    <nav className="pt-4 pb-2 px-3 sm:px-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left spacer — keeps center links truly centered */}
        <div />

        {/* Center nav links */}
        <div className="flex items-center gap-6">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
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

        {/* Right: Contact CTA */}
        <div className="flex justify-end">
          <Link
            href="/contact"
            className={`text-[15px] font-body px-3 py-1 rounded-md border transition-colors ${
              isContactActive
                ? "border-ink-900 text-ink-900 font-semibold"
                : "border-ink-900/50 text-ink-500 hover:border-ink-900 hover:text-ink-800"
            }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
