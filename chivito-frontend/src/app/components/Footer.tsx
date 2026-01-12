"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Brega logo"
            className="h-6 w-6 object-contain"
          />
          © {new Date().getFullYear()} Chivito
        </span>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-gray-800">
            About
          </Link>
          <Link href="/developers" className="hover:text-gray-800">
            Developers
          </Link>
          <Link href="/terms" className="hover:text-gray-800">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-800">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-gray-800">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
