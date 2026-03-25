import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionAccent from "@/components/SectionAccent";
import { getAllCabins } from "@/lib/cabins";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ cabin?: string; success?: string }>;
}) {
  const params = await searchParams;
  const cabin = params.cabin ?? "";
  const success = params.success === "1";
  const cabins = await getAllCabins();

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div
            className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] p-7 text-white shadow-[0_24px_60px_rgba(74,47,27,0.08)] md:p-8"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(23, 18, 14, 0.48), rgba(23, 18, 14, 0.72)), url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <SectionAccent icon="mail" label="Reservation request" inverted />
            <h1 className="font-heading mt-3 text-5xl font-semibold text-white">
              Send your preferred dates and we will follow up directly.
            </h1>
            <p className="mt-5 text-sm leading-7 text-stone-100">
              Feel free to send a message for any inquiries, and we will answer
              as fast as possible.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-[#f7e7cd]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 4.2 7 6.4v4.3c0 3.2 1.8 5.6 5 7.4 3.2-1.8 5-4.2 5-7.4V6.4l-5-2.2Zm0 4v4.8m-2.4-2.4h4.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-200">
                    What we collect
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  Name, email, phone number, interested chalet, ideal dates, and
                  any extra comments.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-[#f7e7cd]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="m12 3.9 1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6L12 3.9Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-200">
                    Best for
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  A direct booking workflow without marketplace commissions.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-[#f7e7cd]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 5.2a6.8 6.8 0 1 0 6.8 6.8A6.8 6.8 0 0 0 12 5.2Zm0 2.1V12l3 1.7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-200">
                    Response time
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  Send us your preferred dates, special requests, or questions
                  about the chalet, and we will reply as quickly as possible.
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
                  <select
                    name="chalet"
                    defaultValue={cabin}
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  >
                    <option value="">Select a cabin</option>
                    {cabins.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
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
