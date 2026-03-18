import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-3 text-stone-600">Owner and dev access only.</p>

          <form action="/api/login" method="POST" className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-2xl border border-stone-300 px-4 py-3"
              />
            </div>

            <button className="w-full rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-700">
              Sign in
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}