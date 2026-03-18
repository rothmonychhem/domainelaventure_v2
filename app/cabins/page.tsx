import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getAllCabins } from "@/lib/cabins";

export default async function CabinsPage() {
  const cabins = await getAllCabins();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold">Our Cabins</h1>
        <p className="mt-3 text-stone-600">Browse all available chalets.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {cabins.map((cabin) => (
            <div key={cabin.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${
                    cabin.images[0]?.url ||
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                  }')`,
                }}
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold">{cabin.name}</h2>
                <p className="mt-2 text-stone-600">{cabin.description}</p>
                <p className="mt-2 text-sm text-stone-500">Up to {cabin.guests} guests</p>
                <p className="mt-2 font-medium">From {cabin.price}</p>
                <Link
                  href={`/cabins/${cabin.slug}`}
                  className="mt-5 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}