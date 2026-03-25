import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalizedText } from "@/components/LanguageProvider";
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
            <SectionAccent
              icon="mail"
              label={
                <LocalizedText
                  en="Reservation request"
                  fr="Demande de reservation"
                />
              }
              inverted
            />
            <h1 className="font-heading mt-3 text-5xl font-semibold text-white">
              <LocalizedText
                en="Send your preferred dates and start the conversation directly with us."
                fr="Envoyez vos dates preferees et commencez la conversation directement avec nous."
              />
            </h1>
            <p className="mt-5 text-sm leading-7 text-stone-100">
              <LocalizedText
                en="Ask about availability, group size, amenities, or anything else you would like to know before booking."
                fr="Posez vos questions sur les disponibilites, la taille du groupe, les commodites ou tout autre detail utile avant de reserver."
              />
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
                    <LocalizedText en="What to include" fr="A inclure" />
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  <LocalizedText
                    en="Your contact details, the cabin you want, your ideal dates, and any helpful notes about the stay."
                    fr="Vos coordonnees, le chalet souhaite, vos dates ideales et toute note utile concernant le sejour."
                  />
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
                    <LocalizedText en="Best for" fr="Ideal pour" />
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  <LocalizedText
                    en="Guests who prefer direct planning, clear communication, and a simpler booking path."
                    fr="Les voyageurs qui preferent une planification directe, une communication claire et un parcours de reservation plus simple."
                  />
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
                    <LocalizedText en="What happens next" fr="Et ensuite" />
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-100">
                  <LocalizedText
                    en="We review your request, confirm availability, and follow up with the next steps as quickly as possible."
                    fr="Nous examinons votre demande, confirmons les disponibilites et revenons vers vous avec la suite aussi rapidement que possible."
                  />
                </p>
              </div>
            </div>
          </div>

          <div className="panel rounded-[2rem] p-7 md:p-8">
            {success ? (
              <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                <LocalizedText
                  en="Reservation request sent successfully. We will review it and get back to you shortly."
                  fr="La demande de reservation a ete envoyee avec succes. Nous l'examinerons et reviendrons vers vous rapidement."
                />
              </div>
            ) : null}

            <form action="/api/reserve" method="POST" className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    <LocalizedText en="Name" fr="Nom" />
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    <LocalizedText en="Email" fr="Courriel" />
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
                    <LocalizedText en="Phone number" fr="Numero de telephone" />
                  </label>
                  <input
                    name="phone"
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700">
                    <LocalizedText en="Interested chalet" fr="Chalet souhaite" />
                  </label>
                  <select
                    name="chalet"
                    defaultValue={cabin}
                    required
                    className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                  >
                    <option value="">
                      <LocalizedText en="Select a cabin" fr="Choisir un chalet" />
                    </option>
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
                    <LocalizedText en="Ideal start date" fr="Date d'arrivee ideale" />
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
                    <LocalizedText en="Ideal end date" fr="Date de depart ideale" />
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
                  <LocalizedText en="Other comments" fr="Autres commentaires" />
                </label>
                <textarea
                  name="comments"
                  rows={6}
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>

              <button
                className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
                style={{ color: "#ffffff" }}
              >
                <span className="text-white">
                  <LocalizedText
                    en="Send reservation request"
                    fr="Envoyer la demande de reservation"
                  />
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
