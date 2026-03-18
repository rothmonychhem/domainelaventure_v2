import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-wide">
          Cozy Cabin Escapes
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-stone-600">
            Home
          </Link>
          <Link href="/cabins" className="hover:text-stone-600">
            Cabins
          </Link>
          <Link href="/contact" className="hover:text-stone-600">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}