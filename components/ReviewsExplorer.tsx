"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import Link from "next/link";
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
    <span key={index} className={index < rating ? "text-[#d89a31]" : "text-stone-300"}>
      ★
    </span>
  ));
}

function getReviewAuthor(review: ReviewRecord) {
  if (review.source === "airbnb") {
    return review.reviewerName && review.reviewerName !== "Anonymous"
      ? `${review.reviewerName} from Airbnb`
      : "Review from Airbnb";
  }

  return review.reviewerName && review.reviewerName !== "Anonymous"
    ? review.reviewerName
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
  const [reviews, setReviews] = useState(initialReviews);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [cabinFilter, setCabinFilter] = useState("all");
  const [search, setSearch] = useState("");
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

        setReviews((current) => [payload.review!, ...current]);
        setSuccess("Thanks for sharing your stay. Your review is now live.");
        form.reset();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to save your review."
        );
      }
    });
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel rounded-[2rem] p-7 md:p-8">
          <p className="eyebrow">Leave a review</p>
          <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
            Share the feeling of your stay.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
            Tell future guests what stood out most, whether it was the quiet
            mornings, the fireplace, or the way the forest felt around the cabin.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input type="text" name="website" className="hidden" tabIndex={-1} />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Name
                </label>
                <input
                  name="reviewerName"
                  placeholder="Optional"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Location
                </label>
                <input
                  name="reviewerLocation"
                  placeholder="Optional"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Cabin
                </label>
                <select
                  name="cabinId"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  defaultValue=""
                >
                  <option value="">General experience</option>
                  {cabins.map((cabin) => (
                    <option key={cabin.id} value={cabin.id}>
                      {cabin.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Rating
                </label>
                <select
                  name="rating"
                  defaultValue="5"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                >
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Review title
                </label>
                <input
                  name="title"
                  required
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Stay label
                </label>
                <input
                  name="stayLabel"
                  placeholder="Example: February 2026"
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Review
              </label>
              <textarea
                name="body"
                rows={7}
                required
                className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
              />
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
              {isPending ? "Saving review..." : "Publish review"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div
            className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-cover bg-center px-7 py-8 text-white shadow-[0_24px_60px_rgba(39,61,44,0.14)]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(24, 18, 14, 0.26), rgba(24, 18, 14, 0.56)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <p className="eyebrow text-[#f6d6a9]">Guestbook mood</p>
            <h3 className="font-heading mt-3 text-4xl font-semibold">
              The best stays are felt twice.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-100">
              Once while you are there, and once again when someone else reads
              about the quiet lake air, the warm lights, and the slower pace.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[var(--pine)] p-7 text-white">
            <p className="eyebrow text-[#d6c5a8]">At a glance</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ead6b5]">
                  Published reviews
                </p>
                <p className="font-heading mt-3 text-4xl font-semibold text-[#f7e7cd]">
                  {reviews.length}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ead6b5]">
                  Average rating
                </p>
                <p className="font-heading mt-3 text-4xl font-semibold text-[#f7e7cd]">
                  {averageRating}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-stone-100">
              Imported Airbnb reviews and direct guest notes can live together
              here so the page feels full, honest, and personal.
            </p>
            {importHref ? (
              <Link
                href={importHref}
                className="mt-5 inline-block text-sm font-semibold text-[#f7e7cd] transition hover:text-white"
              >
                Owner import tool
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="panel rounded-[2rem] p-6 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Current reviews</p>
            <h2 className="font-heading mt-2 text-3xl font-semibold text-[var(--accent-dark)]">
              Read through the guest stories
            </h2>
          </div>
          <p className="text-sm font-semibold text-stone-500">
            {filteredReviews.length} result{filteredReviews.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Search reviews
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by cabin, guest, title, or keyword"
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
              <option value="all">All sources</option>
              <option value="airbnb">Airbnb</option>
              <option value="direct">Guest reviews</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            >
              <option value="all">Any rating</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars and up</option>
              <option value="3">3 stars and up</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Cabin
            </label>
            <select
              value={cabinFilter}
              onChange={(event) => setCabinFilter(event.target.value)}
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            >
              <option value="all">All cabins</option>
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
                          From Airbnb
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {getReviewAuthor(review)}
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
                {review.cabinSlug ? (
                  <Link
                    href={`/cabins/${review.cabinSlug}`}
                    className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-dark)]"
                  >
                    Explore this cabin
                  </Link>
                ) : null}
              </article>
            ))
          ) : (
            <div className="soft-ring rounded-[1.6rem] bg-white/72 p-6 text-sm leading-7 text-stone-700">
              No reviews match the current filters yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
