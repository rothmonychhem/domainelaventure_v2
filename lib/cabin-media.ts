import crypto from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

type MediaStateItem =
  | { kind: "existing"; id: string; isHero: boolean }
  | { kind: "new"; fileIndex: number; isHero: boolean };

function sanitizeExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return extension.replace(/[^a-z0-9.]/g, "") || ".bin";
}

function getMediaType(file: File) {
  if (file.type.startsWith("video/")) {
    return "video";
  }

  return "image";
}

export async function saveUploadedMedia(file: File) {
  return saveUploadedMediaToFolder(file, "cabins");
}

export async function saveUploadedMediaToFolder(file: File, folder: string) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });

  const extension = sanitizeExtension(file.name);
  const fileName = `${crypto.randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${folder}/${fileName}`,
    mediaType: getMediaType(file),
  };
}

export function parseMediaState(formData: FormData): MediaStateItem[] {
  const raw = formData.get("mediaState");

  if (typeof raw !== "string" || !raw.trim()) {
    return [];
  }

  const parsed = JSON.parse(raw) as MediaStateItem[];
  return Array.isArray(parsed) ? parsed : [];
}
