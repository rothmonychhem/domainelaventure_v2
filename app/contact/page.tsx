import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ cabin?: string }>;
}) {
  const params = await searchParams;
  const cabin = params.cabin ?? "";

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">Reservation Request</h1>
        <p className="mt-4 text-stone-600">
          Fill the form and we’ll be notified by email.
        </p>

        <form action="/api/reserve" method="POST" className="mt-10 space-y-6 rounded-3xl bg-white p-8 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input name="name" required className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" name="email" required className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Phone number</label>
            <input name="phone" required className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Interested chalet</label>
            <input
              name="chalet"
              defaultValue={cabin}
              required
              className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Start date</label>
              <input type="date" name="startDate" required className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End date</label>
              <input type="date" name="endDate" required className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Other comments</label>
            <textarea name="comments" rows={5} className="w-full rounded-2xl border border-stone-300 px-4 py-3" />
          </div>

          <button className="rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700">
            Send request
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}