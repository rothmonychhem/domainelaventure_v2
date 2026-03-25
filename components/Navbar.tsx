"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const links = [
  { href: "/", en: "Home", fr: "Accueil" },
  { href: "/cabins", en: "Cabins", fr: "Chalets" },
  { href: "/reviews", en: "Reviews", fr: "Avis" },
  { href: "/contract", en: "Contract", fr: "Contrat" },
  { href: "/contact", en: "Reserve", fr: "Reserver" },
];

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#f7efe3]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="min-w-0">
          <div className="eyebrow">Domaine Aventure</div>
          <p className="font-heading mt-1 text-xl font-semibold tracking-tight text-[var(--accent-dark)]">
            {language === "fr"
              ? "Sejours chaleureux en pleine nature"
              : "Cozy chalet stays in nature"}
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-white/55 px-2 py-2 text-sm font-semibold text-stone-700">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 transition hover:bg-white hover:text-[var(--accent-dark)]"
              >
                {language === "fr" ? link.fr : link.en}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-[var(--line)] bg-white/72 px-4 py-2 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-white"
            aria-label={language === "fr" ? "Switch to English" : "Passer en francais"}
          >
            {language === "fr" ? "EN" : "FR"}
          </button>
        </div>
      </div>
    </header>
  );
}
