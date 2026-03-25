import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalizedText } from "@/components/LanguageProvider";
import SectionAccent from "@/components/SectionAccent";
import { getAllCabins } from "@/lib/cabins";

const renterResponsibilities = [
  {
    enTitle: "Property care",
    frTitle: "Entretien du chalet",
    enBody:
      "Maintain the property, furniture, accessories, and installations in good condition.",
    frBody:
      "Maintenez le chalet, le mobilier, les accessoires et les installations en bon etat.",
  },
  {
    enTitle: "Occupancy",
    frTitle: "Occupation",
    enBody:
      "Respect the approved occupancy limit, including the number of guests and pets.",
    frBody:
      "Respectez la limite d'occupation autorisee, y compris pour le nombre de voyageurs et d'animaux.",
  },
  {
    enTitle: "Furniture placement",
    frTitle: "Disposition du mobilier",
    enBody:
      "Leave furniture and accessories in their original locations. Rearrangement fees may apply.",
    frBody:
      "Laissez les meubles et accessoires a leur place d'origine. Des frais peuvent s'appliquer en cas de deplacement.",
  },
  {
    enTitle: "Damage reporting",
    frTitle: "Declaration des dommages",
    enBody:
      "Notify the owner immediately of any damage and cover repair or replacement costs when required.",
    frBody:
      "Informez le proprietaire immediatement de tout dommage et assumez les frais de reparation ou de remplacement au besoin.",
  },
  {
    enTitle: "Departure condition",
    frTitle: "Etat au depart",
    enBody: "Leave the chalet clean, organized, and in the same condition as on arrival.",
    frBody:
      "Laissez le chalet propre, range et dans le meme etat qu'a votre arrivee.",
  },
  {
    enTitle: "Non-smoking policy",
    frTitle: "Politique sans fumee",
    enBody:
      "Smoking inside the chalet is strictly prohibited. Outdoor smoking requires responsible disposal.",
    frBody:
      "Il est strictement interdit de fumer a l'interieur du chalet. A l'exterieur, merci de jeter les megots de facon responsable.",
  },
  {
    enTitle: "Pet policy",
    frTitle: "Politique pour les animaux",
    enBody:
      "Pets are not allowed on beds or sofas, and all pet waste must be cleaned promptly.",
    frBody:
      "Les animaux ne sont pas autorises sur les lits ou les canapes, et leurs dechets doivent etre ramasses rapidement.",
  },
  {
    enTitle: "Spa and outdoor safety",
    frTitle: "Securite du spa et des espaces exterieurs",
    enBody:
      "Use only approved items in the spa and outdoor areas, and follow posted instructions.",
    frBody:
      "Utilisez seulement les articles permis dans le spa et les espaces exterieurs, et suivez les consignes affichees.",
  },
];

const arrivalInfo = [
  {
    en: "Spa heating can be adjusted as needed. Suggested temperatures are 97 F in winter and 95 F in summer.",
    fr: "Le chauffage du spa peut etre ajuste au besoin. Les temperatures suggerees sont 97 F en hiver et 95 F en ete.",
  },
  {
    en: "Feel free to adjust the convectors for your comfort.",
    fr: "N'hesitez pas a ajuster les convecteurs pour votre confort.",
  },
];

const departureInfo = [
  {
    en: "Empty the refrigerator and dispose of trash in outdoor bins.",
    fr: "Videz le refrigerateur et deposez les dechets dans les bacs exterieurs.",
  },
  {
    en: "Put away clean dishes and lower the spa temperature before departure.",
    fr: "Rangez la vaisselle propre et baissez la temperature du spa avant le depart.",
  },
  {
    en: "Lock all doors, including the patio and basement doors.",
    fr: "Verrouillez toutes les portes, y compris celles du patio et du sous-sol.",
  },
];

const stayFacts = [
  {
    en: "Quiet hours help preserve the peaceful forest atmosphere for every guest.",
    fr: "Les heures calmes aident a preserver l'atmosphere paisible de la foret pour chaque voyageur.",
  },
  {
    en: "A quick rule review before arrival usually prevents almost all stay-related issues.",
    fr: "Une lecture rapide des regles avant l'arrivee evite generalement presque tous les problemes de sejour.",
  },
  {
    en: "Clear departure steps make turnover faster and the next check-in smoother.",
    fr: "Des etapes de depart claires accelerent la preparation et rendent l'arrivee suivante plus fluide.",
  },
];

const fallbackMomentImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
];

const socialHighlights = [
  {
    enLabel: "Instagram",
    frLabel: "Instagram",
    enNote: "Behind-the-scenes cabin mood, morning light, and seasonal styling.",
    frNote: "Ambiance des chalets, lumiere du matin et details de saison en coulisses.",
  },
  {
    enLabel: "Facebook",
    frLabel: "Facebook",
    enNote: "Weekend openings, family-friendly updates, and last-minute specials.",
    frNote: "Disponibilites de fin de semaine, nouvelles familiales et offres de derniere minute.",
  },
  {
    enLabel: "Guest list",
    frLabel: "Liste invites",
    enNote: "A simple place to share insider info, events, and quiet-season offers.",
    frNote: "Un endroit simple pour partager infos privilegiees, evenements et offres de basse saison.",
  },
];

function getCabinCardImage(
  images: Array<{ url: string; mediaType: string; isHero: boolean }>
) {
  return (
    images.find((image) => image.isHero && image.mediaType === "image")?.url ||
    images.find((image) => image.mediaType === "image")?.url ||
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  );
}

export const dynamic = "force-dynamic";

export default async function ContractPage() {
  const cabins = await getAllCabins();
  const spotlightCabin =
    cabins.length > 0 ? cabins[new Date().getDate() % cabins.length] : null;
  const cabinMomentImages = [
    ...(spotlightCabin?.images
      .filter((image) => image.mediaType === "image")
      .map((image) => image.url) ?? []),
    ...fallbackMomentImages,
  ].slice(0, 3);

  return (
    <main className="shell min-h-screen">
      <Navbar />
      <section className="px-6 pb-8 pt-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--line)] bg-white/55 px-7 py-10 md:px-10">
          <SectionAccent icon="shield" label={<LocalizedText en="Rental contract" fr="Contrat de location" />} />
          <h1 className="font-heading mt-3 text-5xl font-semibold text-[var(--accent-dark)]">
            <LocalizedText en="Important information and chalet rules for renters" fr="Informations importantes et regles du chalet pour les locataires" />
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
            <LocalizedText en="Thank you for choosing Domaine l Aventur for your stay. Please review the responsibilities, arrival notes, and departure instructions below." fr="Merci d'avoir choisi Domaine l Aventur pour votre sejour. Veuillez consulter ci-dessous les responsabilites, notes d'arrivee et consignes de depart." />
          </p>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel rounded-[2rem] p-7 md:p-8">
            <SectionAccent icon="key" label={<LocalizedText en="Renter responsibilities" fr="Responsabilites du locataire" />} />
            <div className="mt-6 grid gap-4">
              {renterResponsibilities.map((rule) => (
                <article key={rule.enTitle} className="soft-ring rounded-[1.4rem] bg-white/70 p-5">
                  <h2 className="font-heading flex items-center gap-3 text-2xl font-semibold text-[var(--accent-dark)]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(239,229,206,0.9)] text-[var(--accent-dark)]">+</span>
                    <LocalizedText en={rule.enTitle} fr={rule.frTitle} />
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    <LocalizedText en={rule.enBody} fr={rule.frBody} />
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="map" label={<LocalizedText en="Arrival information" fr="Informations d'arrivee" />} />
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                {arrivalInfo.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <span><LocalizedText en={item.en} fr={item.fr} /></span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="leaf" label={<LocalizedText en="Departure information" fr="Informations de depart" />} />
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                {departureInfo.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <span><LocalizedText en={item.en} fr={item.fr} /></span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[2rem] bg-[var(--pine)] p-7 text-white">
              <SectionAccent icon="pine" label={<LocalizedText en="Additional notes" fr="Notes additionnelles" />} inverted />
              <p className="mt-4 text-sm leading-7 text-stone-100">
                <LocalizedText en="Failure to follow the chalet rules may result in fees deducted from the security deposit." fr="Le non-respect des regles du chalet peut entrainer des frais deduits du depot de securite." />
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-100">
                <LocalizedText en="We appreciate your cooperation and hope you enjoy a wonderful stay." fr="Nous vous remercions de votre collaboration et vous souhaitons un excellent sejour." />
              </p>
              <p className="mt-6 font-semibold text-[#f7e7cd]">
                <LocalizedText en={<>Best regards,<br />Domaine l Aventur</>} fr={<>Cordialement,<br />Domaine l Aventur</>} />
              </p>
            </section>

            <section className="panel overflow-hidden rounded-[2rem]">
              {spotlightCabin ? (
                <>
                  <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(23, 18, 14, 0.08), rgba(23, 18, 14, 0.38)), url('${getCabinCardImage(spotlightCabin.images)}')` }} />
                  <div className="p-7">
                    <SectionAccent icon="spark" label={<LocalizedText en="Cabin spotlight" fr="Chalet en vedette" />} />
                    <h2 className="font-heading mt-4 text-3xl font-semibold text-[var(--accent-dark)]">{spotlightCabin.name}</h2>
                    <p className="mt-2 text-sm font-medium text-stone-500">{spotlightCabin.address}</p>
                    <p className="mt-4 text-sm leading-7 text-stone-700">{spotlightCabin.description}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link href={`/cabins/${spotlightCabin.slug}`} className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent)]">
                        <LocalizedText en="View this cabin" fr="Voir ce chalet" />
                      </Link>
                      <Link href={`/contact?cabin=${encodeURIComponent(spotlightCabin.name)}`} className="rounded-full border border-[var(--line)] px-5 py-3 text-center text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-white">
                        <LocalizedText en="Request this stay" fr="Demander ce sejour" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-7">
                  <SectionAccent icon="spark" label={<LocalizedText en="Cabin spotlight" fr="Chalet en vedette" />} />
                  <h2 className="font-heading mt-4 text-3xl font-semibold text-[var(--accent-dark)]">
                    <LocalizedText en="A retreat preview will appear here" fr="Un apercu du refuge apparaitra ici" />
                  </h2>
                </div>
              )}
            </section>

            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="leaf" label={<LocalizedText en="Good to know" fr="Bon a savoir" />} />
              <div className="mt-5 space-y-4">
                {stayFacts.map((fact) => (
                  <div key={fact.en} className="soft-ring rounded-[1.4rem] bg-white/70 px-4 py-4 text-sm leading-7 text-stone-700">
                    <LocalizedText en={fact.en} fr={fact.fr} />
                  </div>
                ))}
              </div>
            </section>

            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="spark" label={<LocalizedText en="Cabin moments" fr="Instants du chalet" />} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="min-h-[10rem] rounded-[1.5rem] bg-cover bg-center sm:col-span-2" style={{ backgroundImage: `linear-gradient(180deg, rgba(23, 18, 14, 0.1), rgba(23, 18, 14, 0.28)), url('${cabinMomentImages[0]}')` }} />
                <div className="min-h-[8.5rem] rounded-[1.5rem] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(23, 18, 14, 0.08), rgba(23, 18, 14, 0.24)), url('${cabinMomentImages[1]}')` }} />
                <div className="min-h-[8.5rem] rounded-[1.5rem] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(23, 18, 14, 0.08), rgba(23, 18, 14, 0.24)), url('${cabinMomentImages[2]}')` }} />
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                <LocalizedText en="A quick glimpse of the atmosphere guests come for: forest air, slower mornings, and warm chalet evenings." fr="Un apercu de l'ambiance que les voyageurs viennent chercher : air de foret, matins plus doux et soirees de chalet chaleureuses." />
              </p>
            </section>

            <section className="rounded-[2rem] border border-[rgba(48,71,46,0.14)] bg-[linear-gradient(180deg,rgba(224,236,217,0.92),rgba(244,248,239,0.88))] p-7 shadow-[0_24px_60px_rgba(39,61,44,0.12)]">
              <SectionAccent icon="mail" label={<LocalizedText en="Follow for specials" fr="Suivre pour les offres" />} />
              <h2 className="font-heading mt-4 text-3xl font-semibold text-[var(--accent-dark)]">
                <LocalizedText en="Follow along for insider updates and seasonal offers." fr="Suivez-nous pour les nouveautes privees et les offres de saison." />
              </h2>
              <div className="mt-5 space-y-3">
                {socialHighlights.map((item) => (
                  <div key={item.enLabel} className="soft-ring rounded-[1.4rem] bg-white/72 px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--accent-dark)]">
                      <LocalizedText en={item.enLabel} fr={item.frLabel} />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-stone-700">
                      <LocalizedText en={item.enNote} fr={item.frNote} />
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-5 inline-block rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]">
                <LocalizedText en="Ask about current offers" fr="Demander les offres du moment" />
              </Link>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
