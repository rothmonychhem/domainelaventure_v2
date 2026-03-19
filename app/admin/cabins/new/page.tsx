import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CabinEditorForm from "@/components/CabinEditorForm";

export default async function NewCabinPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-[#f6efe5] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--line)] bg-white/82 p-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
        <p className="eyebrow">Admin</p>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
          Add a new cabin
        </h1>
        <CabinEditorForm action="/api/cabins" submitLabel="Create cabin" />
      </div>
    </main>
  );
}
