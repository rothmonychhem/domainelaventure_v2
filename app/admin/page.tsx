import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllCabins } from "@/lib/cabins";

export const dynamic = "force-dynamic";

function getCabinHeroImage(
  images: Array<{ url: string; mediaType: string; isHero: boolean }>
) {
  return (
    images.find((image) => image.isHero && image.mediaType === "image")?.url ||
    images.find((image) => image.mediaType === "image")?.url ||
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  );
}

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const cabins = await getAllCabins();

  return (
    <main className="shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] border border-[var(--line)] bg-white/80 px-7 py-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Admin dashboard</p>
              <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                Manage cabins and reservation-ready content
              </h1>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                Signed in as {session.email} ({session.role})
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {session.role === "owner" ? (
                <form action="/api/cabins/mock" method="POST">
                  <button className="rounded-full border border-[var(--line)] bg-[rgba(86,112,71,0.12)] px-5 py-3 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-[rgba(86,112,71,0.2)]">
                    Create mock cabin
                  </button>
                </form>
              ) : null}
              <Link
                href="/admin/cabins/new"
                className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
              >
                Add new cabin
              </Link>
              <Link
                href="/admin/reviews"
                className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                Manage reviews
              </Link>
              <form action="/api/logout" method="POST">
                <button className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-[rgba(48,71,46,0.14)] bg-[linear-gradient(180deg,rgba(224,236,217,0.92),rgba(244,248,239,0.88))] p-7 shadow-[0_24px_60px_rgba(39,61,44,0.12)]">
            <p className="eyebrow">Quick actions</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
              Test the owner flow fast
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
              Use a mock cabin to verify the admin dashboard, cabin list, detail
              page, and reservation path without typing a full listing by hand.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {session.role === "owner" ? (
                <form action="/api/cabins/mock" method="POST">
                  <button className="rounded-full bg-[var(--accent-dark)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]">
                    Create mock cabin now
                  </button>
                </form>
              ) : (
                <div className="rounded-[1.2rem] border border-[var(--line)] bg-white/70 px-4 py-3 text-sm leading-6 text-stone-700">
                  The mock-cabin shortcut is visible only to the owner account.
                </div>
              )}

              <Link
                href="/admin/cabins/new"
                className="rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-white"
              >
                Add a real cabin manually
              </Link>
              <Link
                href="/admin/reviews"
                className="rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-white"
              >
                Import Airbnb reviews
              </Link>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--line)] bg-white/82 p-7 shadow-[0_24px_60px_rgba(39,61,44,0.1)]">
            <p className="eyebrow">Theme update</p>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
              Stronger forest styling
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
              <div className="soft-ring rounded-[1.4rem] bg-[rgba(234,242,228,0.8)] px-4 py-3">
                The beige base has been shifted greener across the whole app.
              </div>
              <div className="soft-ring rounded-[1.4rem] bg-[rgba(234,242,228,0.8)] px-4 py-3">
                The forest photo and tree silhouette background are now much
                more visible.
              </div>
              <div className="soft-ring rounded-[1.4rem] bg-[rgba(234,242,228,0.8)] px-4 py-3">
                Admin pages now sit on the same forest shell instead of plain
                flat beige backgrounds.
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {cabins.length === 0 ? (
            <article className="rounded-[2rem] border border-[var(--line)] bg-white/82 p-7 shadow-[0_24px_60px_rgba(74,47,27,0.08)] lg:col-span-2">
              <p className="eyebrow">Getting started</p>
              <h2 className="font-heading mt-3 text-3xl font-semibold text-[var(--accent-dark)]">
                No cabins yet
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
                Add your first real cabin manually, or if you are signed in as
                the owner, generate a mock cabin to quickly test the full admin,
                listing, detail page, and reservation flow.
              </p>
            </article>
          ) : null}
          {cabins.map((cabin) => (
            <article
              key={cabin.id}
              className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/82 shadow-[0_24px_60px_rgba(74,47,27,0.08)]"
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(27, 20, 16, 0.06), rgba(27, 20, 16, 0.2)), url('${getCabinHeroImage(
                    cabin.images
                  )}')`,
                }}
              />

              <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-3xl font-semibold text-[var(--accent-dark)]">
                    {cabin.name}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-stone-500">
                    {cabin.address}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {cabin.description}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--pine)]">
                  From {cabin.price}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                <span>{cabin.guests} guests</span>
                <span>{cabin.bedrooms} bedrooms</span>
                <span>{cabin.bathrooms} bathrooms</span>
              </div>

              <Link
                href={`/admin/cabins/${cabin.id}`}
                className="mt-6 inline-block rounded-full bg-[var(--accent-dark)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
              >
                Edit cabin
              </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
