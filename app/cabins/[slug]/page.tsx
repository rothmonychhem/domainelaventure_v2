import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CabinDetailGallery from "@/components/CabinDetailGallery";
import { LocalizedText } from "@/components/LanguageProvider";
import { getCabinBySlug } from "@/lib/cabins";
import { amenityOptions } from "@/lib/amenities";
import { getPublishedReviewsForCabin } from "@/lib/reviews";

export const dynamic = "force-dynamic";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < rating ? "text-[#d89a31]" : "text-stone-300"}
    >
      {"\u2605"}
    </span>
  ));
}

function getLeadHighlights(cabin: Awaited<ReturnType<typeof getCabinBySlug>>) {
  if (!cabin) {
    return [];
  }

  const highlights = [
    cabin.selfCheckIn
      ? {
          enTitle: "Self check-in",
          enBody: "Easy arrival without waiting for an in-person handoff.",
          frTitle: "Arrivee autonome",
          frBody: "Arrivee simple sans remise de cles en personne.",
        }
      : null,
    cabin.lakeAccess
      ? {
          enTitle: "Lake access",
          enBody: "A nature-forward stay with water access or nearby views.",
          frTitle: "Acces au lac",
          frBody: "Un sejour nature avec acces au lac ou vues sur l'eau.",
        }
      : null,
    cabin.fireplace
      ? {
          enTitle: "Fireplace evenings",
          enBody: "A warmer, chalet-style atmosphere after a full day outside.",
          frTitle: "Soirees au coin du feu",
          frBody: "Une ambiance plus chaleureuse apres une journee dehors.",
        }
      : null,
    cabin.fullKitchen
      ? {
          enTitle: "Full kitchen",
          enBody: "Built for real meals, longer stays, and relaxed hosting.",
          frTitle: "Cuisine complete",
          frBody: "Ideale pour les vrais repas, les longs sejours et les reunions.",
        }
      : null,
    cabin.hotTub
      ? {
          enTitle: "Hot tub reset",
          enBody: "A spa-style detail that makes the stay feel more special.",
          frTitle: "Moment spa",
          frBody: "Un detail bien-etre qui rend le sejour plus memorable.",
        }
      : null,
    cabin.workspace
      ? {
          enTitle: "Workspace ready",
          enBody: "Comfortable for remote work or a slower midweek escape.",
          frTitle: "Espace de travail",
          frBody: "Confortable pour le teletravail ou une pause en semaine.",
        }
      : null,
  ].filter(
    (
      highlight
    ): highlight is {
      enTitle: string;
      enBody: string;
      frTitle: string;
      frBody: string;
    } => Boolean(highlight)
  );

  return highlights.slice(0, 3);
}

export default async function CabinDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cabin = await getCabinBySlug(slug);

  if (!cabin) notFound();

  const cabinReviews = await getPublishedReviewsForCabin(cabin.id);
  const leadHighlights = getLeadHighlights(cabin);
  const availableAmenities = amenityOptions.filter((amenity) => cabin[amenity.name]);
  const englishDescription = cabin.description;
  const frenchDescription = cabin.descriptionFr?.trim() || cabin.description;
  const mediaItems =
    cabin.images.length > 0
      ? cabin.images
      : [{ id: "fallback", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80", mediaType: "image", isHero: true, position: 0 }];

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-12 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow">
                <LocalizedText en="Cabin stay" fr="Sejour en chalet" />
              </p>
              <h1 className="font-heading mt-3 text-4xl font-semibold leading-tight text-[var(--accent-dark)] md:text-6xl">
                {cabin.name}
              </h1>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                {cabin.address}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-stone-700">
                <span className="rounded-full border border-[var(--line)] bg-white/72 px-4 py-2">
                  <LocalizedText
                    en={`${cabin.guests} guests`}
                    fr={`${cabin.guests} voyageurs`}
                  />
                </span>
                <span className="rounded-full border border-[var(--line)] bg-white/72 px-4 py-2">
                  <LocalizedText
                    en={`${cabin.bedrooms} bedrooms`}
                    fr={`${cabin.bedrooms} chambres`}
                  />
                </span>
                <span className="rounded-full border border-[var(--line)] bg-white/72 px-4 py-2">
                  <LocalizedText
                    en={`${cabin.bathrooms} bathrooms`}
                    fr={`${cabin.bathrooms} salles de bain`}
                  />
                </span>
                <span className="rounded-full border border-[rgba(48,71,46,0.22)] bg-[var(--accent-dark)] px-4 py-2 text-white">
                  <LocalizedText
                    en={`From $${cabin.price} / night`}
                    fr={`A partir de $${cabin.price} / nuit`}
                  />
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/cabins"
                className="rounded-full border border-[var(--line)] bg-white/72 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-white"
              >
                <LocalizedText en="Back to cabins" fr="Retour aux chalets" />
              </Link>
              <Link
                href={`/contact?cabin=${encodeURIComponent(cabin.name)}`}
                className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)] hover:text-white visited:text-white"
                style={{ color: "#ffffff" }}
              >
                <span className="text-white">
                  <LocalizedText en="Reserve this cabin" fr="Reserver ce chalet" />
                </span>
              </Link>
            </div>
          </div>

          <CabinDetailGallery cabinName={cabin.name} mediaItems={mediaItems} />
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-8">
            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="panel rounded-[2rem] p-7 md:p-8">
                <p className="eyebrow">
                  <LocalizedText en="About this stay" fr="A propos du sejour" />
                </p>
                <p className="mt-5 max-w-3xl text-base leading-8 text-stone-700 md:text-lg">
                  <LocalizedText
                    en={englishDescription}
                    fr={frenchDescription}
                  />
                </p>
              </article>

              <article className="panel rounded-[2rem] p-7 md:p-8">
                <p className="eyebrow">
                  <LocalizedText en="Cabin trip ideas" fr="Idees pour un sejour en chalet" />
                </p>
                <div className="mt-5 grid gap-3">
                  <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-4 text-sm leading-6 text-stone-700">
                    <LocalizedText
                      en="Slow mornings with coffee, blankets, and a quieter start to the day."
                      fr="Des matins paisibles avec cafe, couvertures et un debut de journee tout en douceur."
                    />
                  </div>
                  <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-4 text-sm leading-6 text-stone-700">
                    <LocalizedText
                      en="Long dinners, card games, and evening conversations after a full day outside."
                      fr="De longs soupers, des jeux de cartes et de belles conversations apres une journee dehors."
                    />
                  </div>
                  <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-4 text-sm leading-6 text-stone-700">
                    <LocalizedText
                      en="A simple nature reset: fresh air, fewer distractions, and more time together."
                      fr="Une vraie pause en nature : de l'air frais, moins de distractions et plus de temps ensemble."
                    />
                  </div>
                </div>
              </article>
            </section>

            {leadHighlights.length > 0 ? (
              <section className="panel rounded-[2rem] p-7 md:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="eyebrow">
                      <LocalizedText en="Stay highlights" fr="Points forts" />
                    </p>
                    <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
                      <LocalizedText
                        en="Why this cabin stands out"
                        fr="Pourquoi ce chalet se distingue"
                      />
                    </h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {leadHighlights.map((highlight) => (
                    <div
                      key={highlight.enTitle}
                      className="soft-ring rounded-[1.5rem] bg-white/72 p-5"
                    >
                      <p className="text-sm font-semibold text-[var(--accent-dark)]">
                        <LocalizedText
                          en={highlight.enTitle}
                          fr={highlight.frTitle}
                        />
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        <LocalizedText
                          en={highlight.enBody}
                          fr={highlight.frBody}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="panel rounded-[2rem] p-7 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow">
                    <LocalizedText en="Amenities" fr="Commodites" />
                  </p>
                  <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
                    <LocalizedText
                      en="What this place offers"
                      fr="Ce que ce lieu offre"
                    />
                  </h2>
                </div>
                <p className="text-sm font-semibold text-stone-500">
                  {availableAmenities.length}{" "}
                  <LocalizedText en="selected features" fr="elements inclus" />
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {availableAmenities.length > 0 ? (
                  availableAmenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="soft-ring rounded-[1.4rem] bg-white/72 p-5"
                    >
                      <p className="text-sm font-semibold text-[var(--accent-dark)]">
                        {amenity.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {amenity.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="soft-ring rounded-[1.4rem] bg-white/72 p-5 text-sm leading-6 text-stone-600 sm:col-span-2 xl:col-span-3">
                    <LocalizedText
                      en="Amenities have not been added for this chalet yet."
                      fr="Les commodites n'ont pas encore ete ajoutees pour ce chalet."
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="panel rounded-[2rem] p-7 md:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow">
                    <LocalizedText en="Guest reviews" fr="Avis voyageurs" />
                  </p>
                  <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
                    <LocalizedText
                      en={`What guests say about ${cabin.name}`}
                      fr={`Ce que les voyageurs disent de ${cabin.name}`}
                    />
                  </h2>
                </div>
                <Link
                  href="/reviews"
                  className="text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-dark)]"
                >
                  <LocalizedText en="View all reviews" fr="Voir tous les avis" />
                </Link>
              </div>
              <div className="mt-6 space-y-4">
                {cabinReviews.length > 0 ? (
                  cabinReviews.slice(0, 3).map((review) => (
                    <article
                      key={review.id}
                      className="soft-ring rounded-[1.5rem] bg-white/72 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
                              {review.title}
                            </p>
                            {review.source === "airbnb" ? (
                              <span className="rounded-full bg-[rgba(86,112,71,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dark)]">
                                <LocalizedText en="From Airbnb" fr="Depuis Airbnb" />
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 text-sm font-medium text-stone-500">
                            <LocalizedText
                              en={
                                review.reviewerName && review.reviewerName !== "Anonymous"
                                  ? review.source === "airbnb"
                                    ? `${review.reviewerName} from Airbnb`
                                    : review.reviewerName
                                  : review.source === "airbnb"
                                    ? "Review from Airbnb"
                                    : "Anonymous guest"
                              }
                              fr={
                                review.reviewerName && review.reviewerName !== "Anonymous"
                                  ? review.source === "airbnb"
                                    ? `${review.reviewerName} via Airbnb`
                                    : review.reviewerName
                                  : review.source === "airbnb"
                                    ? "Avis provenant d'Airbnb"
                                    : "Voyageur anonyme"
                              }
                            />
                            {review.reviewerLocation ? `, ${review.reviewerLocation}` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg leading-none">
                            {renderStars(review.rating)}
                          </div>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                            <LocalizedText
                              en={review.stayLabel || "Recent stay"}
                              fr={review.stayLabel || "Sejour recent"}
                            />
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-stone-700">
                        {review.body}
                      </p>
                      {review.imageUrls.length > 0 ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {review.imageUrls.map((url) => (
                            <div
                              key={url}
                              className="h-40 rounded-[1.4rem] bg-cover bg-center"
                              style={{ backgroundImage: `url('${url}')` }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <div className="soft-ring rounded-[1.5rem] bg-white/72 p-5 text-sm leading-7 text-stone-700">
                    <LocalizedText
                      en="No guest reviews have been added for this cabin yet."
                      fr="Aucun avis n'a encore ete ajoute pour ce chalet."
                    />
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="panel rounded-[2rem] p-7 md:p-8">
              <p className="eyebrow">
                <LocalizedText en="Reservation" fr="Reservation" />
              </p>
              <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                <LocalizedText
                  en={`From $${cabin.price}`}
                  fr={`A partir de $${cabin.price}`}
                />
              </h2>
              <p className="mt-2 text-sm font-semibold text-stone-500">
                <LocalizedText
                  en="Per night before final booking confirmation"
                  fr="Par nuit avant la confirmation finale"
                />
              </p>

              <div className="mt-6 grid gap-3">
                <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-4 text-sm leading-6 text-stone-700">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    <LocalizedText en="Guests" fr="Voyageurs" />
                  </span>
                  <span className="mt-1 block font-semibold text-[var(--accent-dark)]">
                    {cabin.guests}
                  </span>
                </div>
                <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-4 text-sm leading-6 text-stone-700">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    <LocalizedText en="Bedrooms" fr="Chambres" />
                  </span>
                  <span className="mt-1 block font-semibold text-[var(--accent-dark)]">
                    {cabin.bedrooms}
                  </span>
                </div>
                <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-4 text-sm leading-6 text-stone-700">
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    <LocalizedText en="Bathrooms" fr="Salles de bain" />
                  </span>
                  <span className="mt-1 block font-semibold text-[var(--accent-dark)]">
                    {cabin.bathrooms}
                  </span>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-stone-700">
                <LocalizedText
                  en="Send a direct reservation request with your preferred dates and questions. The owner can respond without any marketplace detour."
                  fr="Envoyez une demande directe avec vos dates preferees et vos questions. Le proprietaire peut repondre sans passer par une plateforme."
                />
              </p>
              <Link
                href={`/contact?cabin=${encodeURIComponent(cabin.name)}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)] hover:text-white visited:text-white"
                style={{ color: "#ffffff" }}
              >
                <span className="text-white">
                  <LocalizedText en="Request to reserve" fr="Demander une reservation" />
                </span>
              </Link>
            </section>

            <section className="panel rounded-[2rem] p-7">
              <p className="eyebrow">
                <LocalizedText en="Good to know" fr="Bon a savoir" />
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                <li>
                  <LocalizedText
                    en="This page is built to help guests compare the stay before booking, with photos, amenities, and direct contact."
                    fr="Cette page aide les voyageurs a comparer le sejour avant de reserver, avec photos, commodites et contact direct."
                  />
                </li>
                <li>
                  <LocalizedText
                    en="The reservation request goes directly to the owner, without marketplace detours."
                    fr="La demande de reservation arrive directement au proprietaire, sans detour par une plateforme."
                  />
                </li>
                <li>
                  <LocalizedText
                    en="Guests can open the gallery in full view to inspect the photos more closely before deciding."
                    fr="Les voyageurs peuvent ouvrir la galerie en plein ecran pour regarder les photos plus en detail avant de choisir."
                  />
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
