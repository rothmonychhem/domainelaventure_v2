import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCabinById } from "@/lib/cabins";
import CabinEditorForm from "@/components/CabinEditorForm";

export const dynamic = "force-dynamic";

export default async function EditCabinPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const query = await searchParams;
  const cabin = await getCabinById(id);

  if (!cabin) {
    return <main className="p-10">Cabin not found.</main>;
  }

  return (
    <main className="shell min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--line)] bg-white/82 p-8 shadow-[0_24px_60px_rgba(74,47,27,0.08)]">
        <p className="eyebrow">Admin</p>
        <Link
          href="/admin"
          className="mt-3 inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          Back to admin
        </Link>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--accent-dark)]">
          Edit cabin
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700">
          Update the listing while keeping the admin interface visually aligned
          with the greener, forest-led direction of the site.
        </p>
        {query.error === "db" ? (
          <div className="mt-6 rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-900">
            The cabin could not be updated because the database connection is unavailable right now.
          </div>
        ) : null}
        <CabinEditorForm
          action={`/api/cabins/${cabin.id}`}
          submitLabel="Save changes"
          initialValues={{
            name: cabin.name,
            address: cabin.address,
            description: cabin.description,
            descriptionFr: cabin.descriptionFr ?? "",
            price: cabin.price,
            guests: cabin.guests,
            bedrooms: cabin.bedrooms,
            bathrooms: cabin.bathrooms,
            wifi: cabin.wifi,
            hotTub: cabin.hotTub,
            lakeAccess: cabin.lakeAccess,
            fireplace: cabin.fireplace,
            bbq: cabin.bbq,
            airConditioning: cabin.airConditioning,
            fullKitchen: cabin.fullKitchen,
            washerDryer: cabin.washerDryer,
            workspace: cabin.workspace,
            petFriendly: cabin.petFriendly,
            selfCheckIn: cabin.selfCheckIn,
            freeParking: cabin.freeParking,
          }}
          initialMedia={cabin.images.map((image) => ({
            id: image.id,
            url: image.url,
            mediaType: image.mediaType,
            isHero: image.isHero,
          }))}
        />
      </div>
    </main>
  );
}
