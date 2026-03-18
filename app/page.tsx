import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllCabins } from "@/lib/cabins";

export default async function HomePage() {
  const cabins = await getAllCabins();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative flex min-h-[75vh] items-center justify-center bg-[url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">Your Cozy Escape in Nature</h1>
          <p className="mt-4 text-lg md:text-xl">
            Warm cabins, peaceful stays, and a simple reservation experience.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/cabins"
              className="rounded-full bg-white px-6 py-3 font-semibold text-stone-900 hover:bg-stone-200"
            >
              Explore Cabins
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-stone-900"
            >
              Reserve Now
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold">Featured cabins</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cabins.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p>No cabins yet. Login as owner/dev to add one.</p>
            </div>
          ) : (
            cabins.slice(0, 3).map((cabin) => (
              <div key={cabin.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div
                  className="h-56 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${
                      cabin.images[0]?.url ||
                      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
                    }')`,
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{cabin.name}</h3>
                  <p className="mt-2 text-stone-600">{cabin.description}</p>
                  <p className="mt-3 font-medium">From {cabin.price}</p>
                  <Link
                    href={`/cabins/${cabin.slug}`}
                    className="mt-4 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}