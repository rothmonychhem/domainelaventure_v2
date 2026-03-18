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
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Edit cabin</h1>

        <form action={`/api/cabins/${cabin.id}`} method="POST" className="mt-8 space-y-5">
          <input name="name" required defaultValue={cabin.name} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="slug" required defaultValue={cabin.slug} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <textarea name="description" required rows={4} defaultValue={cabin.description} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="price" required defaultValue={cabin.price} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="guests" required type="number" defaultValue={cabin.guests} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="bedrooms" required type="number" defaultValue={cabin.bedrooms} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="bathrooms" required type="number" defaultValue={cabin.bathrooms} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Gallery image URLs in order, one per line
            </label>
            <textarea
              name="images"
              rows={8}
              defaultValue={cabin.images.map((img) => img.url).join("\n")}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            />
          </div>

          <button className="rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700">
            Save changes
          </button>
        </form>
      </div>
    </main>
  );
}