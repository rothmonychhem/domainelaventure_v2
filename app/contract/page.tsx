import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export default function ContractPage() {
  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-8 pt-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--line)] bg-white/55 px-7 py-10 md:px-10">
          <p className="eyebrow">Rental contract</p>
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
            <p className="eyebrow">Renter responsibilities</p>
            <div className="mt-6 grid gap-4">
              {renterResponsibilities.map((rule) => (
                <article
                  key={rule.title}
                  className="soft-ring rounded-[1.4rem] bg-white/70 p-5"
                >
                  <h2 className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
                    {rule.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-stone-700">{rule.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="panel rounded-[2rem] p-7">
              <p className="eyebrow">Arrival information</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                {arrivalInfo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="panel rounded-[2rem] p-7">
              <p className="eyebrow">Departure information</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                {departureInfo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-[2rem] bg-[var(--pine)] p-7 text-white">
              <p className="eyebrow text-[#d6c5a8]">Additional notes</p>
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
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
