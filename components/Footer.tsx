import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[#2b241d] text-stone-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-stone-300">Domaine Aventure</p>
          <h2 className="font-heading mt-2 text-3xl font-semibold text-[#f8ecd8]">
            Warm spaces, slower mornings, and stays worth remembering.
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Built for a small chalet business with a simple admin, low-cost hosting,
            and direct reservation requests.
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/reviews" className="text-stone-300 transition hover:text-white">
            Guest reviews
          </Link>
          <Link href="/contract" className="text-stone-300 transition hover:text-white">
            Chalet rules
          </Link>
          <Link href="/contact" className="text-stone-300 transition hover:text-white">
            Reservation form
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-stone-100 transition hover:border-white/40 hover:bg-white/10"
          >
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
