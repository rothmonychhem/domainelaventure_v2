import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/cabins", label: "Cabins" },
  { href: "/contract", label: "Contract" },
  { href: "/contact", label: "Reserve" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#f7efe3]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="min-w-0">
          <div className="eyebrow">Domaine Aventure</div>
          <p className="font-heading mt-1 text-xl font-semibold tracking-tight text-[var(--accent-dark)]">
            Cozy chalet stays in nature
          </p>
        </Link>

        <nav className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/55 px-2 py-2 text-sm font-semibold text-stone-700">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition hover:bg-white hover:text-[var(--accent-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
