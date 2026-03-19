import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCabinById } from "@/lib/cabins";

export default async function EditCabinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const cabin = await getCabinById(id);

  if (!cabin) {
    return <main className="p-10">Cabin not found.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f6efe5] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--line)] bg-white/82 p-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
        <p className="eyebrow">Admin</p>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
          Edit cabin
        </h1>

        <form action={`/api/cabins/${cabin.id}`} method="POST" className="mt-8 space-y-5">
          <input name="name" required defaultValue={cabin.name} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <input name="slug" required defaultValue={cabin.slug} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <textarea name="description" required rows={5} defaultValue={cabin.description} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <input name="price" required defaultValue={cabin.price} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <div className="grid gap-5 md:grid-cols-3">
            <input name="guests" required type="number" defaultValue={cabin.guests} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
            <input name="bedrooms" required type="number" defaultValue={cabin.bedrooms} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
            <input name="bathrooms" required type="number" defaultValue={cabin.bathrooms} className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Gallery image URLs in order, one per line
            </label>
            <textarea
              name="images"
              rows={8}
              defaultValue={cabin.images.map((img) => img.url).join("\n")}
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </div>

          <button className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]">
            Save changes
          </button>
        </form>
      </div>
    </main>
  );
}
