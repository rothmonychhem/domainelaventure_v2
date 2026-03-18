import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCabinBySlug } from "@/lib/cabins";
import { notFound } from "next/navigation";

export default async function CabinDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cabin = await getCabinBySlug(slug);

  if (!cabin) notFound();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section
        className="h-[55vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            cabin.images[0]?.url ||
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80"
          }')`,
        }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold">{cabin.name}</h1>
        <p className="mt-4 text-lg text-stone-600">{cabin.description}</p>
        <p className="mt-4 text-xl font-semibold">Starting at {cabin.price}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">Guests</p>
            <p className="mt-2 text-2xl font-semibold">{cabin.guests}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">Bedrooms</p>
            <p className="mt-2 text-2xl font-semibold">{cabin.bedrooms}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">Bathrooms</p>
            <p className="mt-2 text-2xl font-semibold">{cabin.bathrooms}</p>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-bold">Gallery</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cabin.images.map((image) => (
            <div
              key={image.id}
              className="h-56 rounded-3xl bg-cover bg-center"
              style={{ backgroundImage: `url('${image.url}')` }}
            />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href={`/contact?cabin=${encodeURIComponent(cabin.name)}`}
            className="rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700"
          >
            Reserve this cabin
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}