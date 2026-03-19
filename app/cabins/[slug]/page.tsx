import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCabinBySlug } from "@/lib/cabins";
import { amenityOptions } from "@/lib/amenities";

export const dynamic = "force-dynamic";

export default async function CabinDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cabin = await getCabinBySlug(slug);

  if (!cabin) notFound();

  const heroImage =
    cabin.images.find((image) => image.isHero && image.mediaType === "image")?.url ||
    cabin.images.find((image) => image.mediaType === "image")?.url ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";
  const availableAmenities = amenityOptions.filter((amenity) => cabin[amenity.name]);

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-10 pt-6">
        <div
          className="mx-auto flex min-h-[62vh] max-w-7xl items-end overflow-hidden rounded-[2.25rem] border border-[var(--line)] bg-cover bg-center px-7 py-8 md:px-10 md:py-10"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(19, 14, 11, 0.18), rgba(19, 14, 11, 0.56)), url('${heroImage}')`,
          }}
        >
          <div className="max-w-3xl text-white">
            <p className="eyebrow text-[#f8d7a7]">Private retreat</p>
            <h1 className="section-title mt-4 text-white">{cabin.name}</h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f7dfba]">
              {cabin.address}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-100 md:text-lg">
              {cabin.description}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">Stay details</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="soft-ring rounded-[1.5rem] bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Guests
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.guests}
                  </p>
                </div>
                <div className="soft-ring rounded-[1.5rem] bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Bedrooms
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.bedrooms}
                  </p>
                </div>
                <div className="soft-ring rounded-[1.5rem] bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Bathrooms
                  </p>
                  <p className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                    {cabin.bathrooms}
                  </p>
                </div>
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">Gallery</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {(cabin.images.length > 0
                  ? cabin.images
                  : [{ id: "fallback", url: heroImage, mediaType: "image" }]
                ).map((image, index) => (
                  <div
                    key={image.id}
                    className={index === 0 ? "md:col-span-2" : undefined}
                  >
                    {image.mediaType === "video" ? (
                      <video
                        src={image.url}
                        className={`w-full rounded-[1.5rem] object-cover ${
                          index === 0 ? "h-80" : "h-56"
                        }`}
                        controls
                      />
                    ) : (
                      <div
                        className={`rounded-[1.5rem] bg-cover bg-center ${
                          index === 0 ? "h-80" : "h-56"
                        }`}
                        style={{ backgroundImage: `url('${image.url}')` }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">What this place offers</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {availableAmenities.length > 0 ? (
                  availableAmenities.map((amenity) => (
                    <div
                      key={amenity.name}
                      className="soft-ring rounded-[1.4rem] bg-white/70 p-5"
                    >
                      <p className="text-sm font-semibold text-[var(--accent-dark)]">
                        {amenity.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {amenity.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="soft-ring rounded-[1.4rem] bg-white/70 p-5 text-sm leading-6 text-stone-600 sm:col-span-2">
                    Amenities have not been added for this chalet yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">Reservation</p>
              <h2 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
                Starting from {cabin.price}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                Invite guests to send a direct reservation request with their
                preferred dates and questions. No marketplace detour required.
              </p>
              <Link
                href={`/contact?cabin=${encodeURIComponent(cabin.name)}`}
                className="mt-6 inline-block rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]"
              >
                Reserve this cabin
              </Link>
            </div>

            <div className="panel rounded-[2rem] p-7">
              <p className="eyebrow">Why guests will love it</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                <li>Peaceful nature setting with a more intimate brand feel.</li>
                <li>Visual detail page that helps each cabin stand on its own.</li>
                <li>Simple inquiry path that goes directly to your business.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
