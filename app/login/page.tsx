import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="shell min-h-screen">
      <Navbar />

      <section className="px-6 py-10">
        <div className="mx-auto max-w-xl">
          <div className="panel rounded-[2rem] p-8 md:p-10">
            <p className="eyebrow">Private access</p>
            <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
              Owner and developer login
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-700">
              This area is only for managing cabin content and reviewing the
              direct-booking setup.
            </p>

            {hasError ? (
              <div className="mt-6 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-900">
                The credentials were not recognized. Try the owner or developer
                account again.
              </div>
            ) : null}

            <form action="/api/login" method="POST" className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
                />
              </div>

              <button className="w-full rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
