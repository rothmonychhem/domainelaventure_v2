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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">
            <LocalizedText
              en="A warm guestbook for every stay and every cabin."
              fr="Un livre d'or chaleureux pour chaque sejour et chaque chalet."
            />
          </p>
          <h1 className="font-heading mt-3 text-6xl font-semibold text-[var(--accent-dark)] md:text-7xl">
            <LocalizedText en="Guest reviews" fr="Avis voyageurs" />
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-700">
            <LocalizedText
              en="Feel free to leave a note and share your experience so other guests can discover the kind of amazing moments that make a cabin stay special."
              fr="N'hesitez pas a laisser un mot et a partager votre experience pour aider les autres voyageurs a decouvrir les beaux moments qui rendent un sejour en chalet si special."
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
