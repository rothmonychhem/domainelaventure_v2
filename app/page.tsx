import Link from "next/link";
import FeaturedCabinsSlideshow from "@/components/FeaturedCabinsSlideshow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalizedText } from "@/components/LanguageProvider";
import SectionAccent from "@/components/SectionAccent";
import { getAllCabins } from "@/lib/cabins";

export const dynamic = "force-dynamic";

const quickLinks = [
  { href: "/cabins", en: "See cabins", fr: "Voir les chalets" },
  { href: "/reviews", en: "Read reviews", fr: "Lire les avis" },
  { href: "/contract", en: "View contract", fr: "Voir le contrat" },
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
  const featuredSlides = featuredCabins.map((cabin) => ({
    id: cabin.id,
    slug: cabin.slug,
    name: cabin.name,
    address: cabin.address,
    description: cabin.description,
    descriptionFr: cabin.descriptionFr,
    guests: cabin.guests,
    price: cabin.price,
    image: getCabinCardImage(cabin.images),
  }));

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-12 pt-6 md:pb-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            className="panel relative min-h-[34rem] overflow-hidden rounded-[2rem] px-7 py-10 md:min-h-[42rem] md:px-10 md:py-14"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24, 18, 14, 0.24), rgba(24, 18, 14, 0.34)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative flex h-full max-w-2xl flex-col justify-end text-white">
              <p className="eyebrow text-[#f8d7a7]">
                <LocalizedText en="Domaine l Aventure" fr="Domaine l Aventure" />
              </p>
              <h1 className="section-title mt-4 max-w-3xl text-white">
                <LocalizedText
                  en="Spend quality time with family, nature, and slower moments that feel worth remembering."
                  fr="Passez de beaux moments en famille, au coeur de la nature, et profitez d'un rythme plus doux qui laisse de vrais souvenirs."
                />
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-100 md:text-lg">
                <LocalizedText
                  en="Discover cozy chalets, peaceful surroundings, and direct booking for a warm and simple getaway."
                  fr="Decouvrez des chalets chaleureux, des paysages paisibles et une reservation directe pour une escapade simple et memorable."
                />
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/cabins"
                  className="rounded-full bg-[#f6e7cf] px-6 py-3 text-center font-semibold text-[var(--accent-dark)] transition hover:bg-white"
                >
                  <LocalizedText en="Explore the cabins" fr="Explorer les chalets" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/50 px-6 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-[var(--accent-dark)]"
                >
                  <LocalizedText
                    en="Plan your stay"
                    fr="Planifier votre sejour"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="panel rounded-[2rem] p-7 md:p-8">
              <SectionAccent
                icon="spark"
                label={<LocalizedText en="Quick links" fr="Liens rapides" />}
              />
              <div className="mt-5 space-y-4">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="soft-ring flex items-start gap-3 rounded-[1.5rem] bg-white/70 px-4 py-4 text-sm font-semibold leading-6 text-stone-700 transition hover:bg-white"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(239,229,206,0.9)] text-[var(--accent-dark)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="M7 12h10m0 0-4-4m4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </span>
                    <LocalizedText en={item.en} fr={item.fr} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7 md:p-8">
              <SectionAccent
                icon="mail"
                label={<LocalizedText en="Reservation" fr="Reservation" />}
              />
              <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
                <p>
                  <LocalizedText
                    en="Find your perfect dream vacation cabin, fill out the form, and we will contact you as fast as possible."
                    fr="Trouvez le chalet ideal pour vos vacances, remplissez le formulaire et nous vous contacterons le plus rapidement possible."
                  />
                </p>
                <p>
                  <LocalizedText
                    en="It is a simple and direct way to ask about dates, availability, and the kind of stay you have in mind."
                    fr="C'est une facon simple et directe de demander des dates, des disponibilites et le type de sejour que vous imaginez."
                  />
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
              <p className="eyebrow">
                <LocalizedText en="Featured cabins" fr="Chalets en vedette" />
              </p>
              <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                <LocalizedText
                  en="A first look at the retreat experience"
                  fr="Un premier apercu de l'experience du refuge"
                />
              </h2>
            </div>
            <Link
              href="/cabins"
              className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-dark)]"
            >
              <LocalizedText en="View all cabins" fr="Voir tous les chalets" />
            </Link>
          </div>

          <div className="mt-10">
            {featuredCabins.length === 0 ? (
              <div className="panel rounded-[2rem] p-8 text-stone-700">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-heading text-3xl font-semibold text-[var(--accent-dark)]">
                      <LocalizedText
                        en="Your featured cabins will appear here."
                        fr="Vos chalets en vedette apparaitront ici."
                      />
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">
                      <LocalizedText
                        en="Add your first cabin from the admin dashboard to start building the public collection and reservation flow."
                        fr="Ajoutez votre premier chalet depuis l'administration pour lancer la collection publique et le parcours de reservation."
                      />
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent)] hover:text-white visited:text-white"
                    style={{ color: "#ffffff" }}
                  >
                    <span className="text-white">
                      <LocalizedText en="Go to admin" fr="Aller a l'administration" />
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <FeaturedCabinsSlideshow cabins={featuredSlides} />
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-18 pt-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] bg-[var(--pine)] px-7 py-10 text-white md:grid-cols-[0.95fr_1.05fr] md:px-10">
          <div>
            <p className="eyebrow text-[#d6c5a8]">
              <LocalizedText en="Great family time" fr="Beaux moments en famille" />
            </p>
            <h2 className="font-heading mt-3 text-4xl font-semibold text-[#f7e7cd]">
              <LocalizedText
                en="The best cabin trips are often the simplest ones."
                fr="Les plus beaux sejours en chalet sont souvent les plus simples."
              />
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone-100">
            <p>
              <LocalizedText
                en="Think long breakfasts, card games by the table, quiet walks, stories by the fire, and evenings spent together without rushing."
                fr="Pensez aux longs dejeuners, aux jeux de cartes autour de la table, aux promenades tranquilles, aux histoires pres du feu et aux soirees sans se presser."
              />
            </p>
            <p>
              <LocalizedText
                en="A chalet stay is often about reconnecting: fresh air, slower mornings, good meals, and more time with the people you came with."
                fr="Un sejour en chalet, c'est souvent l'occasion de se retrouver : de l'air frais, des matins plus doux, de bons repas et davantage de temps avec ceux qui vous accompagnent."
              />
            </p>
            <div className="pt-2">
              <SectionAccent
                icon="pine"
                label={
                  <LocalizedText
                    en="Nature, comfort, family time"
                    fr="Nature, confort, temps en famille"
                  />
                }
                inverted
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
