import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LocalizedText } from "@/components/LanguageProvider";
import ReviewsExplorer from "@/components/ReviewsExplorer";
import { getSession } from "@/lib/auth";
import { getAllCabins } from "@/lib/cabins";
import { getPublishedReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [session, cabins, reviews] = await Promise.all([
    getSession(),
    getAllCabins(),
    getPublishedReviews(),
  ]);

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 pb-8 pt-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--line)] bg-white/55 px-7 py-10 md:px-10">
          <p className="eyebrow">
            <LocalizedText en="Guest reviews" fr="Avis voyageurs" />
          </p>
          <h1 className="font-heading mt-3 text-5xl font-semibold text-[var(--accent-dark)]">
            <LocalizedText
              en="A warm guestbook for every stay and every cabin."
              fr="Un livre d'or chaleureux pour chaque sejour et chaque chalet."
            />
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
            <LocalizedText
              en="Guests can leave a note, read through past stays, and explore what each cabin feels like through real feedback."
              fr="Les voyageurs peuvent laisser un mot, lire les sejours passes et decouvrir l'ambiance de chaque chalet a travers de vrais avis."
            />
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 pt-2">
        <div className="mx-auto max-w-7xl">
          <ReviewsExplorer
            initialReviews={reviews}
            cabins={cabins.map((cabin) => ({ id: cabin.id, name: cabin.name }))}
            importHref={session?.role === "owner" ? "/admin/reviews" : undefined}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
