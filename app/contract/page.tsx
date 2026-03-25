import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionAccent from "@/components/SectionAccent";
import { getAllCabins } from "@/lib/cabins";

const renterResponsibilities = [
  {
    title: "Property care",
    body: "Maintain the condition of the property, including all furniture, accessories, and installations.",
  },
  {
    title: "Occupancy",
    body: "Follow the occupancy limits stated in the rental contract, including the number of people and pets. DO NOT exceed the approved limit.",
  },
  {
    title: "Furniture placement",
    body: "Leave all furniture and accessories in their original locations. DO NOT rearrange them. A $200 fee will apply for any rearrangements.",
  },
  {
    title: "Damage reporting",
    body: "Notify the owner IMMEDIATELY of any damages and reimburse for repairs or replacements as necessary.",
  },
  {
    title: "Departure condition",
    body: "Leave the chalet CLEAN, ORGANIZED, and in the SAME condition as upon arrival.",
  },
  {
    title: "Non-smoking policy",
    body: "Smoking inside the chalet is STRICTLY PROHIBITED. A fee of $300-$500 will be charged for violations. Smoking is allowed outside; please dispose of cigarette butts responsibly.",
  },
  {
    title: "Pet policy",
    body: "Pets are NOT allowed on beds or sofas. Clean up all pet waste promptly. Additional cleaning fees will apply for pet hair found on furniture, bedding, or blankets.",
  },
  {
    title: "Glassware restrictions",
    body: "DO NOT use glassware in the spa or outdoor areas. Plastic cups are provided. A fee of $300-$500 will apply if glass is found in the spa, requiring a FULL water change.",
  },
  {
    title: "Dishware and dishwasher use",
    body: "Wash and return all dishes to their proper places. DO NOT place plastic dishware in the dishwasher as it may melt.",
  },
  {
    title: "Prohibited items",
    body: "Firearms and fireworks are STRICTLY FORBIDDEN on the property.",
  },
  {
    title: "Snowmobiles and ATVs",
    body: "Permitted use is restricted to accessing MARKED TRAILS ONLY.",
  },
  {
    title: "Liability disclaimer",
    body: "The owner is NOT responsible for injuries, losses, or damages sustained by renters or guests on the property. Use of recreational equipment is at your own risk.",
  },
  {
    title: "Child supervision",
    body: "Renters are FULLY responsible for supervising children, particularly near the lake or road.",
  },
  {
    title: "Spa guidelines",
    body: "Follow the posted spa instructions to ensure SAFE and proper use.",
  },
  {
    title: "Security cameras",
    body: "Exterior cameras are installed for SECURITY purposes and to monitor occupancy limits.",
  },
  {
    title: "Uncontrollable events",
    body: "The owner is NOT liable for issues beyond their control, such as internet or power outages.",
  },
];

const arrivalInfo = [
  "Spa heating: adjust the spa temperature as needed. Allow one hour per 3°F increase. Suggested temperatures are 97°F in winter and 95°F in summer.",
  "Heating adjustment: feel free to adjust the convectors for your comfort.",
];

const departureInfo = [
  "Empty the refrigerator and dispose of trash in outdoor bins.",
  "Empty and put away clean dishes from the dishwasher.",
  "Lower the spa temperature to 85-90°F and secure the cover.",
  "Set heating to 17°C unless otherwise instructed for subsequent rentals.",
  "Ensure all doors, including the patio and basement doors, are LOCKED.",
  "To lock the entrance door, wave your hand over the black part of the lock until you hear it engage.",
];

const stayFacts = [
  "Quiet hours help preserve the peaceful forest atmosphere for every guest.",
  "A quick rule review before arrival usually prevents nearly all stay-related issues.",
  "Clear departure steps make turnover faster and keep the next check-in smooth.",
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

function getPolicyIcon(title: string): ReactNode {
  switch (title) {
    case "Property care":
      return (
        <path
          d="M12 4.4 5.7 8v4.3c0 3.7 2.2 6.4 6.3 8.4 4.1-2 6.3-4.7 6.3-8.4V8L12 4.4Zm0 3.6v8.2m-3.2-4.1h6.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Occupancy":
      return (
        <path
          d="M9 11a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 9 11Zm6 0a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 15 11Zm-9.5 5.7c.5-2 2.1-3.3 4.1-3.3h.8c2 0 3.6 1.3 4.1 3.3m1-3.1h.3c1.7 0 3.2 1.1 3.6 2.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Furniture placement":
      return (
        <path
          d="M6.2 10.2h11.6v4.3H6.2v-4.3Zm1.1 4.3V18m9.4-3.5V18M8.7 8V6.5h6.6V8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Damage reporting":
      return (
        <path
          d="m14.7 4.9 4.4 4.4m-8.6 8.6-5.1 1 1-5.1L14 6.2a1.8 1.8 0 0 1 2.6 0l1.2 1.2a1.8 1.8 0 0 1 0 2.6l-7.3 7.3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Departure condition":
      return (
        <path
          d="M7.6 13.8 10.4 17l6-9.3m-10.7 9.8h12.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Non-smoking policy":
      return (
        <>
          <path
            d="M5.4 12.6h10.3m2 0h1.9M7.8 10.1c.2-1.7 1.3-2.8 2.9-3.2m1.7-.1c1.7 0 3.1 1.1 3.4 2.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="m6.1 6.1 11.8 11.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      );
    case "Pet policy":
      return (
        <path
          d="M8.2 9.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm3.8-1.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm3.8 1.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM12 18.3c2.5 0 4.6-1.6 4.6-3.5 0-1.4-1-2.1-2.1-2.1-.8 0-1.4.4-2.5 1.1-1.1-.7-1.7-1.1-2.5-1.1-1.1 0-2.1.7-2.1 2.1 0 1.9 2.1 3.5 4.6 3.5Z"
          fill="currentColor"
        />
      );
    case "Glassware restrictions":
      return (
        <>
          <path
            d="M9 5.8h6l-.8 4.4a3.2 3.2 0 0 1-1.7 2.3v4h2.1v1.8H9.4v-1.8h2.1v-4a3.2 3.2 0 0 1-1.7-2.3L9 5.8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="m6.2 6.2 11.6 11.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      );
    case "Dishware and dishwasher use":
      return (
        <path
          d="M8.5 5.8v6.3m-1.8-6.3v6.3m3.6-6.3v6.3m3.2-6.3v5.4c0 .9.7 1.6 1.6 1.6h.4v5.4m2-12.4v12.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Prohibited items":
      return (
        <>
          <path
            d="M8 10.3h8M12 6v8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="m6 6 12 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      );
    case "Snowmobiles and ATVs":
      return (
        <path
          d="M7.1 14.5h9.8m-9.8 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm9.8 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM9.6 14.5 12 9.8h3.3l1.6 2.2m-6.5 0h2.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Liability disclaimer":
      return (
        <path
          d="M12 4.4 5.9 7.8v4.1c0 3.5 2.1 6.1 6.1 8.1 4-2 6.1-4.6 6.1-8.1V7.8L12 4.4Zm0 4.2v4.1m0 3.1h.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Child supervision":
      return (
        <path
          d="M10 8.1a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm4.7 1a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Zm-6.1 8v-3.3c0-1.7 1.4-3.1 3.1-3.1h.1c1.7 0 3.1 1.4 3.1 3.1v3.3m-8.5 0h11"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Spa guidelines":
      return (
        <path
          d="M8.2 14.7c0-1.9 1.7-3.1 3.8-3.1s3.8 1.2 3.8 3.1c0 1.8-1.7 3.1-3.8 3.1s-3.8-1.3-3.8-3.1Zm-2.1-.5c-.9-.8-1.4-1.8-1.4-2.9 0-2.3 1.8-4.2 4.1-4.6m8.8 0c2.3.4 4.1 2.3 4.1 4.6 0 1.1-.5 2.1-1.4 2.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Security cameras":
      return (
        <path
          d="M5.6 10.2h8.1l2.7-2.1v8.6l-2.7-2.1H5.6V10.2Zm9.7 1.4h2.1m-8 6.2h5.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "Uncontrollable events":
      return (
        <path
          d="M7.7 15.6h8.6a3 3 0 0 0 .4-6 4.8 4.8 0 0 0-9-1.3 3.4 3.4 0 0 0 0 7.3Zm5.8-3.5-2.2 3.9m-.2-3.3h2.1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    default:
      return (
        <path
          d="M12 4.5 8.9 8.7h2L7.6 13H10l-3.3 4.7h10.6L14 13h2.4l-3.3-4.3h2L12 4.5Z"
          fill="currentColor"
        />
      );
  }
}

export const dynamic = "force-dynamic";

export default async function ContractPage() {
  const cabins = await getAllCabins();
  const spotlightCabin =
    cabins.length > 0 ? cabins[new Date().getDate() % cabins.length] : null;

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-8 pt-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--line)] bg-white/55 px-7 py-10 md:px-10">
          <SectionAccent icon="shield" label="Rental contract" />
          <h1 className="font-heading mt-3 text-5xl font-semibold text-[var(--accent-dark)]">
            Important information and chalet rules for renters
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
            Thank you for choosing Domaine l Aventur for your stay. To help every
            guest enjoy a comfortable and respectful experience, please review the
            following responsibilities, arrival notes, and departure instructions.
          </p>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel rounded-[2rem] p-7 md:p-8">
            <SectionAccent icon="key" label="Renter responsibilities" />
            <div className="mt-6 grid gap-4">
              {renterResponsibilities.map((rule) => (
                <article
                  key={rule.title}
                  className="soft-ring rounded-[1.4rem] bg-white/70 p-5"
                >
                  <h2 className="flex items-center gap-3 font-heading text-2xl font-semibold text-[var(--accent-dark)]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(239,229,206,0.9)] text-[var(--accent-dark)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        {getPolicyIcon(rule.title)}
                      </svg>
                    </span>
                    {rule.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-stone-700">{rule.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="map" label="Arrival information" />
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                {arrivalInfo.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="leaf" label="Departure information" />
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                {departureInfo.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[2rem] bg-[var(--pine)] p-7 text-white">
              <SectionAccent icon="pine" label="Additional notes" inverted />
              <p className="mt-4 text-sm leading-7 text-stone-100">
                Failure to follow the chalet rules may result in FEES deducted
                from the security deposit.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-100">
                We appreciate your cooperation and hope you enjoy a wonderful
                stay. If you have any questions or require assistance, please do
                not hesitate to reach out.
              </p>
              <p className="mt-6 font-semibold text-[#f7e7cd]">
                Best regards,
                <br />
                Domaine l Aventur
              </p>
            </section>

            <section className="panel overflow-hidden rounded-[2rem]">
              {spotlightCabin ? (
                <>
                  <div
                    className="h-56 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(23, 18, 14, 0.08), rgba(23, 18, 14, 0.38)), url('${getCabinCardImage(
                        spotlightCabin.images
                      )}')`,
                    }}
                  />
                  <div className="p-7">
                    <SectionAccent icon="spark" label="Cabin spotlight" />
                    <h2 className="font-heading mt-4 text-3xl font-semibold text-[var(--accent-dark)]">
                      {spotlightCabin.name}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {spotlightCabin.address}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-stone-700">
                      {spotlightCabin.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                      <span>{spotlightCabin.guests} guests</span>
                      <span>{spotlightCabin.bedrooms} bedrooms</span>
                      <span>{spotlightCabin.bathrooms} bathrooms</span>
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/cabins/${spotlightCabin.slug}`}
                        className="rounded-full bg-[var(--accent-dark)] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
                      >
                        View this cabin
                      </Link>
                      <Link
                        href={`/contact?cabin=${encodeURIComponent(spotlightCabin.name)}`}
                        className="rounded-full border border-[var(--line)] px-5 py-3 text-center text-sm font-semibold text-[var(--accent-dark)] transition hover:bg-white"
                      >
                        Request this stay
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-7">
                  <SectionAccent icon="spark" label="Cabin spotlight" />
                  <h2 className="font-heading mt-4 text-3xl font-semibold text-[var(--accent-dark)]">
                    A retreat preview will appear here
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-stone-700">
                    Once cabins are published, this area will spotlight one of
                    your stays to keep the contract page feeling warmer and more
                    lived in.
                  </p>
                </div>
              )}
            </section>

            <section className="panel rounded-[2rem] p-7">
              <SectionAccent icon="leaf" label="Good to know" />
              <div className="mt-5 space-y-4">
                {stayFacts.map((fact) => (
                  <div
                    key={fact}
                    className="soft-ring rounded-[1.4rem] bg-white/70 px-4 py-4 text-sm leading-7 text-stone-700"
                  >
                    {fact}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
