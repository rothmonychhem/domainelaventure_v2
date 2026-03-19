import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function NewCabinPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-[#f6efe5] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--line)] bg-white/82 p-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
        <p className="eyebrow">Admin</p>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
          Add a new cabin
        </h1>

        <form action="/api/cabins" method="POST" className="mt-8 space-y-5">
          <input name="name" required placeholder="Cabin name" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <input name="slug" required placeholder="forest-haven" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <textarea name="description" required rows={5} placeholder="Describe the atmosphere, setting, and guest experience." className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <input name="price" required placeholder="$199 / night" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          <div className="grid gap-5 md:grid-cols-3">
            <input name="guests" required type="number" placeholder="Guests" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
            <input name="bedrooms" required type="number" placeholder="Bedrooms" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
            <input name="bathrooms" required type="number" placeholder="Bathrooms" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Image URLs, one per line
            </label>
            <textarea
              name="images"
              rows={7}
              placeholder="https://...\nhttps://...\nhttps://..."
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </div>

          <button className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]">
            Create cabin
          </button>
        </form>
      </div>
    </main>
  );
}
