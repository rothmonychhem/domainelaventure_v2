import path from "path";
import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCabinById } from "@/lib/cabins";

function isDatabaseConnectionError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("fetch failed");
}

async function deleteLocalUpload(url: string) {
  if (!url.startsWith("/uploads/")) {
    return;
  }

  try {
    await unlink(path.join(process.cwd(), "public", url.replace(/^\//, "").split("/").join(path.sep)));
  } catch {
    // Ignore missing files so DB cleanup can still complete.
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url), {
      status: 303,
    });
  }

  const { id } = await params;
  const formData = await req.formData();
  const confirmationName = String(formData.get("confirmationName") || "").trim();
  const cabin = await getCabinById(id);

  if (!cabin) {
    return NextResponse.redirect(new URL("/admin", req.url), {
      status: 303,
    });
  }

  if (confirmationName !== cabin.name.trim()) {
    return NextResponse.redirect(
      new URL(`/admin/cabins/${id}?error=delete-confirmation`, req.url),
      {
        status: 303,
      }
    );
  }

  try {
    await prisma.$executeRaw`
      DELETE FROM "Cabin"
      WHERE "id" = ${id}
    `;

    await Promise.all(cabin.images.map((image) => deleteLocalUpload(image.url)));
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.redirect(
        new URL(`/admin/cabins/${id}?error=delete-db`, req.url),
        {
          status: 303,
        }
      );
    }

    throw error;
  }

  return NextResponse.redirect(new URL("/admin", req.url), {
    status: 303,
  });
}
