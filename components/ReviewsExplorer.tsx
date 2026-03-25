"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { ReviewRecord } from "@/lib/reviews";

type CabinOption = {
  id: string;
  name: string;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

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

function getReviewAuthor(review: ReviewRecord, language: "en" | "fr") {
  if (review.source === "airbnb") {
    return review.reviewerName && review.reviewerName !== "Anonymous"
      ? language === "fr"
        ? `${review.reviewerName} via Airbnb`
        : `${review.reviewerName} from Airbnb`
      : language === "fr"
        ? "Avis provenant d'Airbnb"
        : "Review from Airbnb";
  }

  return review.reviewerName && review.reviewerName !== "Anonymous"
    ? review.reviewerName
    : language === "fr"
      ? "Voyageur anonyme"
      : "Anonymous guest";
}

export default function ReviewsExplorer({
  initialReviews,
  cabins,
  importHref,
}: {
  initialReviews: ReviewRecord[];
  cabins: CabinOption[];
  importHref?: string;
}) {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState(initialReviews);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [cabinFilter, setCabinFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const filteredReviews = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSource =
        sourceFilter === "all" ? true : review.source === sourceFilter;
      const matchesRating =
        ratingFilter === "all"
          ? true
          : review.rating >= Number.parseInt(ratingFilter, 10);
      const matchesCabin =
        cabinFilter === "all" ? true : review.cabinId === cabinFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          review.reviewerName,
          review.title,
          review.body,
          review.cabinName ?? "",
          review.stayLabel ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesSource && matchesRating && matchesCabin && matchesSearch;
    });
  }, [cabinFilter, deferredSearch, ratingFilter, reviews, sourceFilter]);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("rating", String(selectedRating));

    startTransition(async () => {
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as {
          error?: string;
          review?: ReviewRecord;
        };

        if (!response.ok || !payload.review) {
          throw new Error(payload.error || "Unable to save your review.");
        }

        const savedReview = payload.review;

        setReviews((current) => [savedReview, ...current]);
        setSuccess(
          language === "fr"
            ? "Merci d'avoir partage votre sejour. Votre avis est maintenant publie."
            : "Thanks for sharing your stay. Your review is now live."
        );
        setSelectedRating(5);
        setPhotoNames([]);
        form.reset();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : language === "fr"
              ? "Impossible d'enregistrer votre avis."
              : "Unable to save your review."
        );
      }
    });
  }

  return (
    <div className="space-y-8">
      <section className="panel rounded-[2rem] p-7 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">
              {language === "fr" ? "Laisser un avis" : "Leave a review"}
            </p>
            <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
              {language === "fr"
                ? "Partagez le ressenti de votre sejour."
                : "Share the feeling of your stay."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              {language === "fr"
                ? "Dites aux futurs voyageurs ce qui vous a le plus marque, que ce soit les matins calmes, le foyer ou l'atmosphere de la foret autour du chalet."
                : "Tell future guests what stood out most, whether it was the quiet mornings, the fireplace, or the way the forest felt around the cabin."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-3 text-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
                {language === "fr" ? "Avis publies" : "Published reviews"}
              </p>
              <p className="font-heading mt-2 text-3xl font-semibold text-[var(--accent-dark)]">
                {reviews.length}
              </p>
            </div>
            <div className="soft-ring rounded-[1.3rem] bg-white/72 px-4 py-3 text-center">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
                {language === "fr" ? "Note moyenne" : "Average rating"}
              </p>
              <p className="font-heading mt-2 text-3xl font-semibold text-[var(--accent-dark)]">
                {averageRating}
              </p>
            </div>
            {importHref ? (
              <Link
                href={importHref}
                className="inline-flex items-center rounded-full border border-[var(--line)] bg-white/72 px-4 py-3 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-white"
              >
                {language === "fr" ? "Outil d'import proprietaire" : "Owner import tool"}
              </Link>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="text" name="website" className="hidden" tabIndex={-1} />
          <input type="hidden" name="rating" value={selectedRating} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                {language === "fr" ? "Nom" : "Name"}
              </label>
              <input
                name="reviewerName"
                placeholder={language === "fr" ? "Optionnel" : "Optional"}
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                {language === "fr" ? "Lieu" : "Location"}
              </label>
              <input
                name="reviewerLocation"
                placeholder={language === "fr" ? "Optionnel" : "Optional"}
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                {language === "fr" ? "Chalet" : "Cabin"}
              </label>
              <select
                name="cabinId"
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                defaultValue=""
              >
                <option value="">
                  {language === "fr" ? "Experience generale" : "General experience"}
                </option>
                {cabins.map((cabin) => (
                  <option key={cabin.id} value={cabin.id}>
                    {cabin.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                {language === "fr" ? "Note en etoiles" : "Star rating"}
              </label>
              <div className="flex items-center gap-2 rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3">
                {Array.from({ length: 5 }, (_, index) => {
                  const starValue = index + 1;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setSelectedRating(starValue)}
                      className="text-2xl leading-none transition hover:scale-110"
                      aria-label={
                        language === "fr"
                          ? `Choisir ${starValue} etoiles`
                          : `Set ${starValue} star rating`
                      }
                    >
                      <span
                        className={
                          starValue <= selectedRating
                            ? "text-[#d89a31]"
                            : "text-stone-300"
                        }
                      >
                        {"\u2605"}
                      </span>
                    </button>
                  );
                })}
                <span className="ml-2 text-sm font-semibold text-stone-600">
                  {selectedRating}/5
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                {language === "fr" ? "Titre de l'avis" : "Review title"}
              </label>
              <input
                name="title"
                required
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                {language === "fr" ? "Repere du sejour" : "Stay label"}
              </label>
              <input
                name="stayLabel"
                placeholder={
                  language === "fr" ? "Exemple : fevrier 2026" : "Example: February 2026"
                }
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              {language === "fr" ? "Avis" : "Review"}
            </label>
            <textarea
              name="body"
              rows={7}
              required
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              {language === "fr" ? "Photos du sejour" : "Stay photos"}
            </label>
            <div className="rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-4">
              <input
                type="file"
                name="photos"
                multiple
                accept="image/*"
                onChange={(event) =>
                  setPhotoNames(
                    Array.from(event.currentTarget.files ?? []).map((file) => file.name)
                  )
                }
                className="w-full text-sm text-stone-700"
              />
              <p className="mt-2 text-xs leading-6 text-stone-500">
                {language === "fr"
                  ? "Optionnel. Jusqu'a 4 images, 5 Mo chacune."
                  : "Optional. Up to 4 images, 5 MB each."}
              </p>
              {photoNames.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photoNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-[rgba(86,112,71,0.12)] px-3 py-1 text-xs font-semibold text-[var(--accent-dark)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {success}
            </div>
          ) : null}

          <button
            disabled={isPending}
            className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending
              ? language === "fr"
                ? "Enregistrement..."
                : "Saving review..."
              : language === "fr"
                ? "Publier l'avis"
                : "Publish review"}
          </button>
        </form>
      </section>

      <section className="panel rounded-[2rem] p-6 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{language === "fr" ? "Avis actuels" : "Current reviews"}</p>
            <h2 className="font-heading mt-2 text-3xl font-semibold text-[var(--accent-dark)]">
              {language === "fr"
                ? "Parcourez les histoires de sejour"
                : "Read through the guest stories"}
            </h2>
          </div>
          <p className="text-sm font-semibold text-stone-500">
            {filteredReviews.length}{" "}
            {language === "fr"
              ? filteredReviews.length === 1
                ? "resultat"
                : "resultats"
              : `result${filteredReviews.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              {language === "fr" ? "Rechercher dans les avis" : "Search reviews"}
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                language === "fr"
                  ? "Rechercher par chalet, voyageur, titre ou mot-cle"
                  : "Search by cabin, guest, title, or keyword"
              }
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            >
              <option value="all">{language === "fr" ? "Toutes les sources" : "All sources"}</option>
              <option value="airbnb">Airbnb</option>
              <option value="direct">{language === "fr" ? "Avis directs" : "Guest reviews"}</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              {language === "fr" ? "Note" : "Rating"}
            </label>
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            >
              <option value="all">{language === "fr" ? "Toutes les notes" : "Any rating"}</option>
              <option value="5">{language === "fr" ? "5 etoiles" : "5 stars"}</option>
              <option value="4">{language === "fr" ? "4 etoiles et plus" : "4 stars and up"}</option>
              <option value="3">{language === "fr" ? "3 etoiles et plus" : "3 stars and up"}</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              {language === "fr" ? "Chalet" : "Cabin"}
            </label>
            <select
              value={cabinFilter}
              onChange={(event) => setCabinFilter(event.target.value)}
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            >
              <option value="all">{language === "fr" ? "Tous les chalets" : "All cabins"}</option>
              {cabins.map((cabin) => (
                <option key={cabin.id} value={cabin.id}>
                  {cabin.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 max-h-[64rem] space-y-4 overflow-y-auto pr-2">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <article
                key={review.id}
                className="soft-ring rounded-[1.6rem] bg-white/72 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
                        {review.title}
                      </p>
                      {review.source === "airbnb" ? (
                        <span className="rounded-full bg-[rgba(86,112,71,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dark)]">
                          {language === "fr" ? "Depuis Airbnb" : "From Airbnb"}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {getReviewAuthor(review, language)}
                      {review.reviewerLocation ? `, ${review.reviewerLocation}` : ""}
                      {review.cabinName ? ` - ${review.cabinName}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg leading-none">{renderStars(review.rating)}</div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      {review.stayLabel || formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-700">{review.body}</p>
                {review.imageUrls.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {review.imageUrls.map((url) => (
                      <div
                        key={url}
                        className="h-40 rounded-[1.4rem] bg-cover bg-center"
                        style={{ backgroundImage: `url('${url}')` }}
                      />
                    ))}
                  </div>
                ) : null}
                {review.cabinSlug ? (
                  <Link
                    href={`/cabins/${review.cabinSlug}`}
                    className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-dark)]"
                  >
                    {language === "fr" ? "Explorer ce chalet" : "Explore this cabin"}
                  </Link>
                ) : null}
              </article>
            ))
          ) : (
            <div className="soft-ring rounded-[1.6rem] bg-white/72 p-6 text-sm leading-7 text-stone-700">
              {language === "fr"
                ? "Aucun avis ne correspond aux filtres pour le moment."
                : "No reviews match the current filters yet."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
