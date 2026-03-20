import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import CabinEditorForm from "@/components/CabinEditorForm";

export default async function NewCabinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#f6efe5] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--line)] bg-white/82 p-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
        <p className="eyebrow">Admin</p>
        <Link
          href="/admin"
          className="mt-3 inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          Back to admin
        </Link>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
          Add a new cabin
        </h1>
        {params.error === "db" ? (
          <div className="mt-6 rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-900">
            The cabin could not be saved because the database connection is unavailable right now.
          </div>
        ) : null}
        <CabinEditorForm action="/api/cabins" submitLabel="Create cabin" />
      </div>
    </main>
  );
}
