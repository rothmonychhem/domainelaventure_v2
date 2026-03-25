"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#2d251e_0%,#221c16_100%)] text-stone-200">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:grid-cols-[1.1fr_0.9fr] md:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#d6c5a8]">Domaine Aventure</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold leading-tight text-[#f8ecd8] md:text-4xl">
              {language === "fr"
                ? "Des sejours chaleureux en nature, pour ralentir et se retrouver."
                : "Warm nature stays made for slower mornings and better time together."}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
              {language === "fr"
                ? "Profitez de moments simples qui font les plus beaux souvenirs : un bon repas, une promenade tranquille, une soiree au chalet et du temps de qualite avec ceux que vous aimez."
                : "Enjoy the simple moments that make the best memories: shared meals, quiet walks, cozy evenings, and real quality time with the people you came with."}
            </p>
          </div>

          <div className="md:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
              {language === "fr" ? "Acces rapide" : "Quick access"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                href="/reviews"
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-stone-200 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
              >
                {language === "fr" ? "Avis voyageurs" : "Guest reviews"}
              </Link>
              <Link
                href="/contract"
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-stone-200 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
              >
                {language === "fr" ? "Regles du chalet" : "Chalet rules"}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-stone-200 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
              >
                {language === "fr" ? "Formulaire de reservation" : "Reservation form"}
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[#f0dcc0]/24 bg-[rgba(240,220,192,0.08)] px-4 py-2 text-stone-100 transition hover:border-[#f0dcc0]/40 hover:bg-[rgba(240,220,192,0.14)]"
              >
                {language === "fr" ? "Connexion" : "Login"}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-5 text-xs uppercase tracking-[0.2em] text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>
            {language === "fr"
              ? "Domaine Aventure • Chalets et sejours en nature"
              : "Domaine Aventure • Cabin stays in nature"}
          </p>
          <p>
            {language === "fr"
              ? "Reservation directe • Experience simple"
              : "Direct booking • Simple experience"}
          </p>
        </div>
      </div>
    </footer>
  );
}
