"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-[var(--line)] bg-[#2b241d] text-stone-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-stone-300">Domaine Aventure</p>
          <h2 className="font-heading mt-2 text-3xl font-semibold text-[#f8ecd8]">
            {language === "fr"
              ? "Des espaces chaleureux, des matins plus doux, et des sejours qui restent en memoire."
              : "Warm spaces, slower mornings, and stays worth remembering."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            {language === "fr"
              ? "Des chalets pensés pour se retrouver, profiter de la nature et creer de beaux souvenirs en famille ou entre proches."
              : "Cabin stays made for family time, nature, and simple moments worth sharing together."}
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/reviews" className="text-stone-300 transition hover:text-white">
            {language === "fr" ? "Avis voyageurs" : "Guest reviews"}
          </Link>
          <Link href="/contract" className="text-stone-300 transition hover:text-white">
            {language === "fr" ? "Regles du chalet" : "Chalet rules"}
          </Link>
          <Link href="/contact" className="text-stone-300 transition hover:text-white">
            {language === "fr" ? "Formulaire de reservation" : "Reservation form"}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-stone-100 transition hover:border-white/40 hover:bg-white/10"
          >
            {language === "fr" ? "Connexion" : "Login"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
