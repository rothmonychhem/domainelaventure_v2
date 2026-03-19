import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ cabin?: string; success?: string }>;
}) {
  const params = await searchParams;
  const cabin = params.cabin ?? "";
  const success = params.success === "1";

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="panel rounded-[2rem] p-7 md:p-8">
            <p className="eyebrow">Reservation request</p>
            <h1 className="font-heading mt-3 text-5xl font-semibold text-[var(--accent-dark)]">
              Send your preferred dates and we will follow up directly.
            </h1>
            <p className="mt-5 text-sm leading-7 text-stone-700">
              This form keeps the process simple and affordable. Requests are
              saved for the admin side and can notify you by email, with optional
              SMS if you connect a low-cost provider later.
            </p>

            <div className="mt-8 space-y-4">
              <div className="soft-ring rounded-[1.5rem] bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  What we collect
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Name, email, phone number, interested chalet, ideal dates, and
                  any extra comments.
                </p>
              </div>
              <div className="soft-ring rounded-[1.5rem] bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Best for
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  A direct booking workflow without marketplace commissions.
                </p>
              </div>
            </div>
          </div>

          <div className="panel rounded-[2rem] p-7 md:p-8">
            {success ? (
              <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                Reservation request sent successfully. We will review it and get
                back to you shortly.
              </div>
            ) : null}

            <form action="/api/reserve" method="POST" className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Phone number
                  </label>
                  <input
                    name="phone"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Interested chalet
                  </label>
                  <input
                    name="chalet"
                    defaultValue={cabin}
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Ideal start date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    Ideal end date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Other comments
                </label>
                <textarea
                  name="comments"
                  rows={6}
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>

              <button className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]">
                Send reservation request
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
