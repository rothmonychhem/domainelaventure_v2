import Link from "next/link";
import FeaturedCabinsSlideshow from "@/components/FeaturedCabinsSlideshow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalizedText } from "@/components/LanguageProvider";
import SectionAccent from "@/components/SectionAccent";
import { getAllCabins } from "@/lib/cabins";

export const dynamic = "force-dynamic";

const highlights = [
  {
    en: "Direct reservation requests with no marketplace fees",
    fr: "Demandes de reservation directes sans frais de plateforme",
  },
  {
    en: "Owner/dev login hidden in the footer for lightweight management",
    fr: "Connexion proprietaire/dev discretement placee dans le pied de page pour une gestion legere",
  },
  {
    en: "Cabin detail pages with galleries, amenities, and clear calls to reserve",
    fr: "Pages detaillees pour chaque chalet avec galerie, commodites et reservation claire",
  },
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
                <LocalizedText en="Forest calm, elevated" fr="Calme de la foret, raffine" />
              </p>
              <h1 className="section-title mt-4 max-w-3xl text-white">
                <LocalizedText
                  en="Cozy chalet stays with a warmer, more memorable brand presence."
                  fr="Des sejours en chalet plus chaleureux, avec une presence de marque plus elegante et memorable."
                />
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-100 md:text-lg">
                <LocalizedText
                  en="Domaine Aventure helps guests discover your cabins, explore each chalet in detail, and send reservation requests directly to you."
                  fr="Domaine Aventure aide les voyageurs a decouvrir vos chalets, explorer chaque sejour en detail et envoyer une demande de reservation directement."
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
                    en="Request a reservation"
                    fr="Demander une reservation"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="panel rounded-[2rem] p-7 md:p-8">
              <SectionAccent
                icon="spark"
                label={
                  <LocalizedText
                    en="Why this setup works"
                    fr="Pourquoi cette approche fonctionne"
                  />
                }
              />
              <div className="mt-5 space-y-4">
                {highlights.map((item) => (
                  <div
                    key={item.en}
                    className="soft-ring flex items-start gap-3 rounded-[1.5rem] bg-white/70 px-4 py-4 text-sm leading-6 text-stone-700"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(239,229,206,0.9)] text-[var(--accent-dark)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          d="m12 4.3 1.5 4.2 4.2 1.5-4.2 1.5-1.5 4.2-1.5-4.2-4.2-1.5 4.2-1.5L12 4.3Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <LocalizedText en={item.en} fr={item.fr} />
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7 md:p-8">
              <SectionAccent
                icon="mail"
                label={<LocalizedText en="Reservation flow" fr="Parcours de reservation" />}
              />
              <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
                <p>
                  <LocalizedText
                    en="Guests choose a cabin, review the details page, and submit a request with their dates and comments."
                    fr="Les voyageurs choisissent un chalet, consultent la page detaillee et envoient une demande avec leurs dates et commentaires."
                  />
                </p>
                <p>
                  <LocalizedText
                    en="Each request is saved in the database and can notify you by email, with optional SMS if you later connect Twilio."
                    fr="Chaque demande est enregistree et peut vous avertir par courriel, avec des SMS en option si vous connectez Twilio plus tard."
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
                        en="The first hero now carries the page."
                        fr="Le grand visuel principal porte maintenant la page."
                      />
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-700">
                      <LocalizedText
                        en="No cabins are published yet, so this area stays quiet until you add one from the admin side."
                        fr="Aucun chalet n'est encore publie, donc cette zone reste sobre jusqu'a ce que vous en ajoutiez un depuis l'administration."
                      />
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                  >
                    <LocalizedText en="Go to admin" fr="Aller a l'administration" />
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
              <LocalizedText en="Low-cost friendly" fr="Pensé pour rester abordable" />
            </p>
            <h2 className="font-heading mt-3 text-4xl font-semibold text-[#f7e7cd]">
              <LocalizedText
                en="Built to stay simple to manage."
                fr="Concu pour rester simple a gerer."
              />
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-stone-100">
            <p>
              <LocalizedText
                en="This structure keeps things efficient: static pages, direct forms, a lightweight admin, and no unnecessary subscription-heavy tools."
                fr="Cette structure reste efficace : pages statiques, formulaires directs, administration legere et aucun outil inutilement charge en abonnements."
              />
            </p>
            <p>
              <LocalizedText
                en="If you want, we can next connect your real branding, add more cabin content, and plug in your notification credentials."
                fr="Si vous le souhaitez, nous pouvons ensuite connecter votre vraie image de marque, ajouter plus de contenu et brancher vos identifiants de notification."
              />
            </p>
            <div className="pt-2">
              <SectionAccent
                icon="pine"
                label={
                  <LocalizedText
                    en="Simple setup, warm guest feel"
                    fr="Mise en place simple, ambiance chaleureuse"
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
