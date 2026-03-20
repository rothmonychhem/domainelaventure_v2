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
    <main className="min-h-screen bg-[#f6efe5] px-6 py-10">
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
              <Link
                href="/admin/cabins/new"
                className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
              >
                Add new cabin
              </Link>
              <form action="/api/logout" method="POST">
                <button className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
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
