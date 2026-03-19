import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllCabins } from "@/lib/cabins";

export const dynamic = "force-dynamic";

export default async function CabinsPage() {
  const cabins = await getAllCabins();

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-8 pt-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--line)] bg-white/55 px-7 py-10 md:px-10">
          <p className="eyebrow">Cabin collection</p>
          <h1 className="font-heading mt-3 text-5xl font-semibold text-[var(--accent-dark)]">
            Browse every chalet and find the right atmosphere for your guests.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
            Each cabin has its own page with visuals, amenities, and a direct
            reservation path. This keeps the browsing experience clear while still
            feeling warm and premium.
          </p>
        </div>
      </section>

      <section className="px-6 pb-18 pt-6">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-2">
          {cabins.map((cabin) => (
            <article
              key={cabin.id}
              className="panel overflow-hidden rounded-[2rem] transition hover:-translate-y-1"
            >
              <div
                className="h-80 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(27, 20, 16, 0.05), rgba(27, 20, 16, 0.22)), url('${
                    cabin.images[0]?.url ||
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                  }')`,
                }}
              />
              <div className="grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                    <span>{cabin.guests} guests</span>
                    <span>{cabin.bedrooms} bedrooms</span>
                    <span>{cabin.bathrooms} bathrooms</span>
                  </div>
                  <h2 className="font-heading mt-4 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.name}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                    {cabin.description}
                  </p>
                </div>

                <div className="space-y-4 md:text-right">
                  <p className="text-sm font-semibold text-[var(--pine)]">
                    Starting from {cabin.price}
                  </p>
                  <Link
                    href={`/cabins/${cabin.slug}`}
                    className="inline-block rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                  >
                    Open detail page
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
