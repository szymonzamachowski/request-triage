"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Board" },
  { href: "/requests", label: "Requests" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-neutral-900">
          request-triage
        </Link>
        <ul className="flex gap-1 text-sm">
          {links.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    active
                      ? "bg-neutral-100 font-medium text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
