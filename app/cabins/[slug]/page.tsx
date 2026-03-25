import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalizedText } from "@/components/LanguageProvider";
import { getCabinBySlug } from "@/lib/cabins";
import { amenityOptions } from "@/lib/amenities";
import { getPublishedReviewsForCabin } from "@/lib/reviews";

export const dynamic = "force-dynamic";

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < rating ? "text-[#d89a31]" : "text-stone-300"}>
      ★
    </span>
  ));
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

  const heroImage =
    cabin.images.find((image) => image.isHero && image.mediaType === "image")?.url ||
    cabin.images.find((image) => image.mediaType === "image")?.url ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";
  const availableAmenities = amenityOptions.filter((amenity) => cabin[amenity.name]);

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-10 pt-6">
        <div
          className="mx-auto flex min-h-[62vh] max-w-7xl items-end overflow-hidden rounded-[2.25rem] border border-[var(--line)] bg-cover bg-center px-7 py-8 md:px-10 md:py-10"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(19, 14, 11, 0.18), rgba(19, 14, 11, 0.56)), url('${heroImage}')`,
          }}
        >
          <div className="max-w-3xl text-white">
            <p className="eyebrow text-[#f8d7a7]">
              <LocalizedText en="Private retreat" fr="Retraite privee" />
            </p>
            <h1 className="section-title mt-4 text-white">{cabin.name}</h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f7dfba]">
              {cabin.address}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100 md:text-lg">
              {cabin.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">
                <LocalizedText en="Stay details" fr="Details du sejour" />
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="soft-ring rounded-[1.5rem] bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    <LocalizedText en="Guests" fr="Voyageurs" />
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.guests}
                  </p>
                </div>
                <div className="soft-ring rounded-[1.5rem] bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    <LocalizedText en="Bedrooms" fr="Chambres" />
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.bedrooms}
                  </p>
                </div>
                <div className="soft-ring rounded-[1.5rem] bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    <LocalizedText en="Bathrooms" fr="Salles de bain" />
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.bathrooms}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">
                <LocalizedText en="Gallery" fr="Galerie" />
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {(cabin.images.length > 0
                  ? cabin.images
                  : [{ id: "fallback", url: heroImage, mediaType: "image" }]
                ).map((image, index) => (
                  <div
                    key={image.id}
                    className={index === 0 ? "md:col-span-2" : undefined}
                  >
                    {image.mediaType === "video" ? (
                      <video
                        src={image.url}
                        className={`w-full rounded-[1.5rem] object-cover ${
                          index === 0 ? "h-80" : "h-56"
                        }`}
                        controls
                      />
                    ) : (
                      <div
                        className={`rounded-[1.5rem] bg-cover bg-center ${
                          index === 0 ? "h-80" : "h-56"
                        }`}
                        style={{ backgroundImage: `url('${image.url}')` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">
                <LocalizedText en="What this place offers" fr="Ce que ce lieu offre" />
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {availableAmenities.length > 0 ? (
                  availableAmenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="soft-ring rounded-[1.4rem] bg-white/70 p-5"
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
                  <div className="soft-ring rounded-[1.4rem] bg-white/70 p-5 text-sm leading-6 text-stone-600 sm:col-span-2">
                    <LocalizedText
                      en="Amenities have not been added for this chalet yet."
                      fr="Les commodites n'ont pas encore ete ajoutees pour ce chalet."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7">
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">
                <LocalizedText en="Reservation" fr="Reservation" />
              </p>
              <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                <LocalizedText
                  en={`Starting from ${cabin.price}`}
                  fr={`A partir de ${cabin.price}`}
                />
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                <LocalizedText
                  en="Invite guests to send a direct reservation request with their preferred dates and questions. No marketplace detour required."
                  fr="Invitez les voyageurs a envoyer une demande de reservation directe avec leurs dates preferees et leurs questions, sans detour par une plateforme."
                />
              </p>
              <Link
                href={`/contact?cabin=${encodeURIComponent(cabin.name)}`}
                className="mt-6 inline-block rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
              >
                <LocalizedText en="Reserve this cabin" fr="Reserver ce chalet" />
              </Link>
            </div>

            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">
                <LocalizedText en="Why guests will love it" fr="Pourquoi ce chalet plaira" />
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                <li>
                  <LocalizedText
                    en="Peaceful nature setting with a more intimate brand feel."
                    fr="Un cadre naturel paisible avec une atmosphere plus intime."
                  />
                </li>
                <li>
                  <LocalizedText
                    en="Visual detail page that helps each cabin stand on its own."
                    fr="Une page detaillee qui permet a chaque chalet de se distinguer."
                  />
                </li>
                <li>
                  <LocalizedText
                    en="Simple inquiry path that goes directly to your business."
                    fr="Un parcours de demande simple qui arrive directement a votre entreprise."
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
