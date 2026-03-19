import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllCabins } from "@/lib/cabins";

export const dynamic = "force-dynamic";

const highlights = [
  "Direct reservation requests with no marketplace fees",
  "Owner/dev login hidden in the footer for lightweight management",
  "Cabin detail pages with galleries, amenities, and clear calls to reserve",
];

function getCabinCardImage(
  images: Array<{ url: string; mediaType: string; isHero: boolean }>
) {
  return (
    images.find((image) => image.isHero && image.mediaType === "image")?.url ||
    images.find((image) => image.mediaType === "image")?.url ||
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
  );
}

export default async function HomePage() {
  const cabins = await getAllCabins();
  const featuredCabins = cabins.slice(0, 3);

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-12 pt-6 md:pb-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            className="panel relative overflow-hidden rounded-[2rem] px-7 py-10 md:px-10 md:py-14"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24, 18, 14, 0.24), rgba(24, 18, 14, 0.34)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative max-w-2xl text-white">
              <p className="eyebrow text-[#f8d7a7]">Forest calm, elevated</p>
              <h1 className="section-title mt-4 max-w-3xl text-white">
                Cozy chalet stays with a warmer, more memorable brand presence.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-100 md:text-lg">
                Domaine Aventure helps guests discover your cabins, explore each
                chalet in detail, and send reservation requests directly to you.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/cabins"
                  className="rounded-full bg-[#f6e7cf] px-6 py-3 text-center font-semibold text-[var(--accent-dark)] transition hover:bg-white"
                >
                  Explore the cabins
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/50 px-6 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-[var(--accent-dark)]"
                >
                  Request a reservation
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="panel rounded-[2rem] p-7 md:p-8">
              <p className="eyebrow">Why this setup works</p>
              <div className="mt-5 space-y-4">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="soft-ring rounded-[1.5rem] bg-white/70 px-4 py-4 text-sm leading-6 text-stone-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7 md:p-8">
              <p className="eyebrow">Reservation flow</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
                <p>
                  Guests choose a cabin, review the details page, and submit a
                  request with their dates and comments.
                </p>
                <p>
                  Each request is saved in the database and can notify you by
                  email, with optional SMS if you later connect Twilio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Featured cabins</p>
              <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                A first look at the retreat experience
              </h2>
            </div>
            <Link
              href="/cabins"
              className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-dark)]"
            >
              View all cabins
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredCabins.length === 0 ? (
              <div className="panel rounded-[2rem] p-8 text-stone-700">
                No cabins yet. Sign in from the footer to add your first chalet.
              </div>
            ) : (
              featuredCabins.map((cabin, index) => (
                <article
                  key={cabin.id}
                  className="panel overflow-hidden rounded-[2rem] transition hover:-translate-y-1"
                >
                  <div
                    className="h-72 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(39, 28, 22, 0.06), rgba(39, 28, 22, 0.2)), url('${getCabinCardImage(
                        cabin.images
                      )}')`,
                    }}
                  />
                  <div className="space-y-4 p-7">
                    <div className="flex items-center justify-between text-sm text-stone-500">
                      <span>0{index + 1}</span>
                      <span>Up to {cabin.guests} guests</span>
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl font-semibold text-[var(--accent-dark)]">
                        {cabin.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-700">
                        {cabin.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--pine)]">
                        Starting from {cabin.price}
                      </p>
                      <Link
                        href={`/cabins/${cabin.slug}`}
                        className="rounded-full bg-[var(--accent-dark)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-18 pt-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] bg-[var(--pine)] px-7 py-10 text-white md:grid-cols-[0.95fr_1.05fr] md:px-10">
          <div>
            <p className="eyebrow text-[#d6c5a8]">Low-cost friendly</p>
            <h2 className="font-heading mt-3 text-4xl font-semibold text-[#f7e7cd]">
              Built to stay simple to manage.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone-100">
            <p>
              This structure keeps things efficient: static pages, direct forms,
              a lightweight admin, and no unnecessary subscription-heavy tools.
            </p>
            <p>
              If you want, we can next connect your real branding, add more cabin
              content, and plug in your notification credentials.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
