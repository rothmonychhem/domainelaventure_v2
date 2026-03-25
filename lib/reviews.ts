import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getAllCabins } from "@/lib/cabins";
import { prisma } from "@/lib/prisma";

const reviewInclude = {
  cabin: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
};

type ReviewWithCabin = Prisma.ReviewGetPayload<{
  include: typeof reviewInclude;
}>;

export type ReviewRecord = {
  id: string;
  reviewerName: string;
  reviewerLocation: string | null;
  title: string;
  body: string;
  rating: number;
  source: string;
  stayLabel: string | null;
  approved: boolean;
  featured: boolean;
  cabinId: string | null;
  cabinName: string | null;
  cabinSlug: string | null;
  createdAt: string;
  updatedAt: string;
};

const reviewsFilePath = path.join(process.cwd(), "data", "reviews.json");

const publicReviewSchema = z.object({
  reviewerName: z.string().trim().min(2).max(80),
  reviewerLocation: z.string().trim().max(80).optional().default(""),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(1400),
  rating: z.coerce.number().int().min(1).max(5),
  stayLabel: z.string().trim().max(80).optional().default(""),
  cabinId: z.string().trim().max(80).optional().default(""),
  cabinName: z.string().trim().max(120).optional().default(""),
});

const importedReviewSchema = z.object({
  reviewerName: z.string().trim().min(2).max(80),
  reviewerLocation: z.string().trim().max(80).optional().default(""),
  title: z.string().trim().max(120).optional().default(""),
  body: z.string().trim().min(20).max(1400),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  stayLabel: z.string().trim().max(80).optional().default(""),
  cabinId: z.string().trim().max(80).optional().default(""),
  cabinName: z.string().trim().max(120).optional().default(""),
  source: z.string().trim().max(40).optional().default("airbnb"),
  featured: z.coerce.boolean().optional().default(false),
});

function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL);
}

function isReviewStorageUnavailable(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("can't reach database server") ||
    message.includes("invalid datasource") ||
    message.includes("accelerate") ||
    message.includes("direct_database_url or database_url must be set") ||
    message.includes("review") && message.includes("does not exist") ||
    message.includes("relation") && message.includes("review")
  );
}

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildReviewTitle(body: string) {
  const words = sanitizeText(body).split(" ").slice(0, 6);
  return words.join(" ") + (words.length >= 6 ? "..." : "");
}

function sortReviews(reviews: ReviewRecord[]) {
  return [...reviews].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  });
}

function mapDbReview(review: ReviewWithCabin): ReviewRecord {
  return {
    id: review.id,
    reviewerName: review.reviewerName,
    reviewerLocation: review.reviewerLocation ?? null,
    title: review.title,
    body: review.body,
    rating: review.rating,
    source: review.source,
    stayLabel: review.stayLabel ?? null,
    approved: review.approved,
    featured: review.featured,
    cabinId: review.cabinId ?? null,
    cabinName: review.cabin?.name ?? null,
    cabinSlug: review.cabin?.slug ?? null,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

async function ensureReviewsFile() {
  await fs.mkdir(path.dirname(reviewsFilePath), { recursive: true });

  try {
    await fs.access(reviewsFilePath);
  } catch {
    await fs.writeFile(reviewsFilePath, "[]\n", "utf8");
  }
}

async function readFileReviews() {
  await ensureReviewsFile();
  const raw = await fs.readFile(reviewsFilePath, "utf8");
  const parsed = JSON.parse(raw) as ReviewRecord[];

  return sortReviews(
    parsed.map((review) => ({
      ...review,
      reviewerLocation: review.reviewerLocation ?? null,
      stayLabel: review.stayLabel ?? null,
      cabinId: review.cabinId ?? null,
      cabinName: review.cabinName ?? null,
      cabinSlug: review.cabinSlug ?? null,
    }))
  );
}

async function writeFileReviews(reviews: ReviewRecord[]) {
  await ensureReviewsFile();
  await fs.writeFile(
    reviewsFilePath,
    `${JSON.stringify(sortReviews(reviews), null, 2)}\n`,
    "utf8"
  );
}

async function resolveCabin(input: { cabinId?: string; cabinName?: string }) {
  const cabins = await getAllCabins();
  const byId = input.cabinId
    ? cabins.find((cabin) => cabin.id === input.cabinId)
    : null;
  const byName =
    !byId && input.cabinName
      ? cabins.find(
          (cabin) =>
            cabin.name.toLowerCase() === sanitizeText(input.cabinName!).toLowerCase()
        )
      : null;
  const cabin = byId ?? byName ?? null;

  return {
    cabinId: cabin?.id ?? null,
    cabinName: cabin?.name ?? sanitizeText(input.cabinName ?? "") || null,
    cabinSlug: cabin?.slug ?? null,
  };
}

export async function getPublishedReviews() {
  if (isDatabaseConfigured()) {
    try {
      const reviews = await prisma.review.findMany({
        where: { approved: true },
        include: reviewInclude,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      });

      return reviews.map(mapDbReview);
    } catch (error) {
      if (!isReviewStorageUnavailable(error)) {
        throw error;
      }
    }
  }

  const reviews = await readFileReviews();
  return reviews.filter((review) => review.approved);
}

export async function getAllStoredReviews() {
  if (isDatabaseConfigured()) {
    try {
      const reviews = await prisma.review.findMany({
        include: reviewInclude,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      });

      return reviews.map(mapDbReview);
    } catch (error) {
      if (!isReviewStorageUnavailable(error)) {
        throw error;
      }
    }
  }

  return readFileReviews();
}

export async function createPublicReview(input: unknown) {
  const parsed = publicReviewSchema.parse(input);
  const now = new Date();
  const cabin = await resolveCabin({
    cabinId: parsed.cabinId,
    cabinName: parsed.cabinName,
  });

  if (isDatabaseConfigured()) {
    try {
      const review = await prisma.review.create({
        data: {
          reviewerName: sanitizeText(parsed.reviewerName),
          reviewerLocation: sanitizeText(parsed.reviewerLocation) || null,
          title: sanitizeText(parsed.title),
          body: sanitizeText(parsed.body),
          rating: parsed.rating,
          source: "direct",
          stayLabel: sanitizeText(parsed.stayLabel) || null,
          approved: true,
          featured: false,
          cabinId: cabin.cabinId,
        },
        include: reviewInclude,
      });

      return mapDbReview(review);
    } catch (error) {
      if (!isReviewStorageUnavailable(error)) {
        throw error;
      }
    }
  }

  const review: ReviewRecord = {
    id: randomUUID(),
    reviewerName: sanitizeText(parsed.reviewerName),
    reviewerLocation: sanitizeText(parsed.reviewerLocation) || null,
    title: sanitizeText(parsed.title),
    body: sanitizeText(parsed.body),
    rating: parsed.rating,
    source: "direct",
    stayLabel: sanitizeText(parsed.stayLabel) || null,
    approved: true,
    featured: false,
    cabinId: cabin.cabinId,
    cabinName: cabin.cabinName,
    cabinSlug: cabin.cabinSlug,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const reviews = await readFileReviews();
  reviews.push(review);
  await writeFileReviews(reviews);

  return review;
}

function parseDelimitedImport(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());

      if (parts.length < 5) {
        throw new Error(
          "Use JSON or pipe-separated rows: reviewer | rating | cabin | title | review | stay label | location"
        );
      }

      const [reviewerName, rating, cabinName, title, body, stayLabel, reviewerLocation] =
        parts;

      return importedReviewSchema.parse({
        reviewerName,
        rating,
        cabinName,
        title,
        body,
        stayLabel,
        reviewerLocation,
      });
    });
}

function parseImportedReviews(raw: string) {
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new Error("Paste at least one review to import.");
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const list = Array.isArray(parsed) ? parsed : [parsed];
    return list.map((entry) => importedReviewSchema.parse(entry));
  } catch {
    return parseDelimitedImport(trimmed);
  }
}

export async function importAirbnbReviews(raw: string) {
  const parsedReviews = parseImportedReviews(raw);

  if (isDatabaseConfigured()) {
    try {
      let createdCount = 0;

      for (const parsed of parsedReviews) {
        const cabin = await resolveCabin({
          cabinId: parsed.cabinId,
          cabinName: parsed.cabinName,
        });

        await prisma.review.create({
          data: {
            reviewerName: sanitizeText(parsed.reviewerName),
            reviewerLocation: sanitizeText(parsed.reviewerLocation) || null,
            title: sanitizeText(parsed.title) || buildReviewTitle(parsed.body),
            body: sanitizeText(parsed.body),
            rating: parsed.rating,
            source: sanitizeText(parsed.source) || "airbnb",
            stayLabel: sanitizeText(parsed.stayLabel) || null,
            approved: true,
            featured: parsed.featured,
            cabinId: cabin.cabinId,
          },
        });

        createdCount += 1;
      }

      return createdCount;
    } catch (error) {
      if (!isReviewStorageUnavailable(error)) {
        throw error;
      }
    }
  }

  const reviews = await readFileReviews();
  const now = new Date().toISOString();

  for (const parsed of parsedReviews) {
    const cabin = await resolveCabin({
      cabinId: parsed.cabinId,
      cabinName: parsed.cabinName,
    });

    reviews.push({
      id: randomUUID(),
      reviewerName: sanitizeText(parsed.reviewerName),
      reviewerLocation: sanitizeText(parsed.reviewerLocation) || null,
      title: sanitizeText(parsed.title) || buildReviewTitle(parsed.body),
      body: sanitizeText(parsed.body),
      rating: parsed.rating,
      source: sanitizeText(parsed.source) || "airbnb",
      stayLabel: sanitizeText(parsed.stayLabel) || null,
      approved: true,
      featured: parsed.featured,
      cabinId: cabin.cabinId,
      cabinName: cabin.cabinName,
      cabinSlug: cabin.cabinSlug,
      createdAt: now,
      updatedAt: now,
    });
  }

  await writeFileReviews(reviews);
  return parsedReviews.length;
}
