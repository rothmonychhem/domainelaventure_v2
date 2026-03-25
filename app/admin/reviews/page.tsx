import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllCabins } from "@/lib/cabins";
import { getAllStoredReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    count?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const [cabins, reviews] = await Promise.all([getAllCabins(), getAllStoredReviews()]);
  const airbnbCount = reviews.filter((review) => review.source === "airbnb").length;
  const directCount = reviews.filter((review) => review.source === "direct").length;

  return (
    <main className="shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-[var(--line)] bg-white/80 px-7 py-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Review admin</p>
              <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                Import Airbnb reviews and manage your guestbook
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700">
                Airbnb does not provide a free official live reviews API for this
                site, so this import tool keeps the workflow simple and free:
                export or copy your reviews, paste them here, and publish them on
                your reviews page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/reviews"
                className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                Open public reviews
              </Link>
              <Link
                href="/admin"
                className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
              >
                Back to admin
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="panel rounded-[1.8rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Total reviews
            </p>
            <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
              {reviews.length}
            </p>
          </article>
          <article className="panel rounded-[1.8rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Airbnb imports
            </p>
            <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
              {airbnbCount}
            </p>
          </article>
          <article className="panel rounded-[1.8rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Direct guest reviews
            </p>
            <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
              {directCount}
            </p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="panel rounded-[2rem] p-7">
            <p className="eyebrow">Import tool</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
              Paste Airbnb reviews
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              Accepted formats:
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
              <div className="soft-ring rounded-[1.4rem] bg-white/70 px-4 py-4">
                JSON array of objects with keys like
                <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  reviewerName
                </code>
                ,
                <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  rating
                </code>
                ,
                <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  cabinName
                </code>
                ,
                <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  title
                </code>
                ,
                <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  body
                </code>
              </div>
              <div className="soft-ring rounded-[1.4rem] bg-white/70 px-4 py-4">
                Pipe-separated rows:
                <code className="ml-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
                  reviewer | rating | cabin | title | review | stay label | location
                </code>
              </div>
            </div>

            {params.success === "1" ? (
              <div className="mt-5 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Imported {params.count || "0"} review{params.count === "1" ? "" : "s"}.
              </div>
            ) : null}
            {params.deleted === "1" ? (
              <div className="mt-5 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Review deleted successfully.
              </div>
            ) : null}
            {params.error ? (
              <div className="mt-5 rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                {params.error}
              </div>
            ) : null}

            <form action="/api/reviews/import" method="POST" className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Review payload
                </label>
                <textarea
                  name="rawReviews"
                  rows={14}
                  required
                  placeholder='[{"reviewerName":"Sophie","rating":5,"cabinName":"La Cedriere","title":"Peaceful weekend","body":"We loved the fireplace and the quiet mornings.","stayLabel":"January 2026"}]'
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>

              <button className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]">
                Import reviews
              </button>
            </form>
          </article>

          <article className="panel rounded-[2rem] p-7">
            <p className="eyebrow">Cabin matching</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
              Available cabin names
            </h2>
            <div className="mt-5 space-y-3">
              {cabins.length > 0 ? (
                cabins.map((cabin) => (
                  <div
                    key={cabin.id}
                    className="soft-ring rounded-[1.4rem] bg-white/70 px-4 py-4 text-sm leading-7 text-stone-700"
                  >
                    <span className="font-semibold text-[var(--accent-dark)]">
                      {cabin.name}
                    </span>
                    <span className="text-stone-500"> - {cabin.address}</span>
                  </div>
                ))
              ) : (
                <div className="soft-ring rounded-[1.4rem] bg-white/70 px-4 py-4 text-sm leading-7 text-stone-700">
                  No cabins yet. Imports still work, but the review will not link
                  to a specific cabin until a matching cabin exists.
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="panel rounded-[2rem] p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Moderation</p>
              <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
                Remove hateful or unwanted reviews
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
                Use this list to remove reviews that are abusive, hateful, spammy,
                or simply not meant to stay public.
              </p>
            </div>
            <p className="text-sm font-semibold text-stone-500">
              {reviews.length} review{reviews.length === 1 ? "" : "s"} available
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="soft-ring rounded-[1.5rem] bg-white/72 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
                          {review.title}
                        </p>
                        <span className="rounded-full bg-[rgba(86,112,71,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dark)]">
                          {review.source}
                        </span>
                        <span className="rounded-full bg-[rgba(48,71,46,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-stone-500">
                        {review.reviewerName}
                        {review.reviewerLocation
                          ? `, ${review.reviewerLocation}`
                          : ""}
                        {review.cabinName ? ` - ${review.cabinName}` : ""}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-stone-700">
                        {review.body}
                      </p>
                    </div>

                    <form
                      action={`/api/reviews/${review.id}/delete`}
                      method="POST"
                      className="shrink-0"
                    >
                      <button className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                        Delete review
                      </button>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <div className="soft-ring rounded-[1.5rem] bg-white/72 p-5 text-sm leading-7 text-stone-700">
                No reviews to moderate yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
