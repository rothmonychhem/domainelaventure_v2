import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllCabins } from "@/lib/cabins";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const cabins = await getAllCabins();

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-stone-600">
              Logged in as {session.email} ({session.role})
            </p>
          </div>

          <form action="/api/logout" method="POST">
            <button className="rounded-full border border-stone-300 px-5 py-2.5 hover:bg-stone-100">
              Logout
            </button>
          </form>
        </div>

        <div className="mt-8">
          <Link
            href="/admin/cabins/new"
            className="rounded-full bg-stone-900 px-5 py-3 text-white hover:bg-stone-700"
          >
            Add new cabin
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cabins.map((cabin) => (
            <div key={cabin.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">{cabin.name}</h2>
              <p className="mt-2 text-stone-600">{cabin.description}</p>
              <p className="mt-3 font-medium">From {cabin.price}</p>

              <Link
                href={`/admin/cabins/${cabin.id}`}
                className="mt-4 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700"
              >
                Edit cabin
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}