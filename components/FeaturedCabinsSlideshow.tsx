"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type FeaturedCabinSlide = {
  id: string;
  slug: string;
  name: string;
  address: string;
  description: string;
  guests: number;
  price: string;
  image: string;
};

type FeaturedCabinsSlideshowProps = {
  cabins: FeaturedCabinSlide[];
};

const AUTO_ROTATE_MS = 4800;

export default function FeaturedCabinsSlideshow({
  cabins,
}: FeaturedCabinsSlideshowProps) {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (cabins.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % cabins.length);
    }, AUTO_ROTATE_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cabins.length]);

  const activeCabin = cabins[activeIndex];

  return (
    <div className="space-y-5">
      <article
        className="relative min-h-[32rem] overflow-hidden rounded-[2rem] border border-[var(--line)] shadow-[0_26px_70px_rgba(39,61,44,0.12)] md:min-h-[36rem]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20, 18, 16, 0.12), rgba(20, 18, 16, 0.58)), url('${activeCabin.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,20,16,0.66),rgba(17,20,16,0.18)_56%,rgba(17,20,16,0.36))]" />
        <div className="relative flex h-full flex-col justify-end px-7 py-8 text-white md:px-10 md:py-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#e6d9bc]">
              {language === "fr"
                ? "Chalet en vedette"
                : "Featured cabin spotlight"}
            </p>
            <h3 className="font-heading mt-4 text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl">
              {activeCabin.name}
            </h3>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#d7d4c4]">
              {activeCabin.address}
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-100 md:text-lg">
              {activeCabin.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#f1ead9]">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                {language === "fr"
                  ? `Jusqu'a ${activeCabin.guests} voyageurs`
                  : `Up to ${activeCabin.guests} guests`}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                {language === "fr"
                  ? `A partir de ${activeCabin.price}`
                  : `Starting from ${activeCabin.price}`}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/cabins/${activeCabin.slug}`}
                className="rounded-full bg-[#f6e7cf] px-6 py-3 text-center font-semibold text-[var(--accent-dark)] transition hover:bg-white"
              >
                {language === "fr" ? "Voir le chalet" : "View cabin details"}
              </Link>
              <Link
                href={`/contact?cabin=${encodeURIComponent(activeCabin.name)}`}
                className="rounded-full border border-white/50 px-6 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-[var(--accent-dark)]"
              >
                {language === "fr" ? "Reserver ce chalet" : "Request this cabin"}
              </Link>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-3 md:grid-cols-3">
        {cabins.map((cabin, index) => (
          <button
            key={cabin.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
              index === activeIndex
                ? "border-[rgba(48,71,46,0.24)] bg-[rgba(234,242,228,0.92)] shadow-[0_18px_40px_rgba(39,61,44,0.08)]"
                : "border-[var(--line)] bg-white/72 hover:bg-white"
            }`}
            aria-pressed={index === activeIndex}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  0{index + 1}
                </p>
                <p className="font-heading mt-2 text-2xl font-semibold text-[var(--accent-dark)]">
                  {cabin.name}
                </p>
              </div>
              <span
                className={`h-3 w-3 rounded-full ${
                  index === activeIndex ? "bg-[var(--accent)]" : "bg-stone-300"
                }`}
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              {cabin.address}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
