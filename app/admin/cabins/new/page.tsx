import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function NewCabinPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Add new cabin</h1>

        <form action="/api/cabins" method="POST" className="mt-8 space-y-5">
          <input name="name" required placeholder="Cabin name" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="slug" required placeholder="slug-example" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <textarea name="description" required rows={4} placeholder="Description" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="price" required placeholder="$199/night" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="guests" required type="number" placeholder="Guests" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="bedrooms" required type="number" placeholder="Bedrooms" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          <input name="bathrooms" required type="number" placeholder="Bathrooms" className="w-full rounded-2xl border border-stone-300 px-4 py-3" />

          <div>
            <label className="mb-2 block text-sm font-medium">Image URLs, one per line</label>
            <textarea
              name="images"
              rows={6}
              placeholder="https://...\nhttps://...\nhttps://..."
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            />
          </div>

          <button className="rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700">
            Create cabin
          </button>
        </form>
      </div>
    </main>
  );
}