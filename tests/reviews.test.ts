import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createPublicReview,
  deleteStoredReview,
  getPublishedReviews,
  importAirbnbReviews,
} from "../lib/reviews";

const dataDir = path.join(process.cwd(), "data");
const reviewsPath = path.join(dataDir, "reviews.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads", "reviews");

const originalDatabaseUrl = process.env.DATABASE_URL;
const originalDirectDatabaseUrl = process.env.DIRECT_DATABASE_URL;

process.env.DATABASE_URL = "";
process.env.DIRECT_DATABASE_URL = "";

async function resetReviewFixtures() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(reviewsPath, "[]\n", "utf8");
  await rm(uploadsDir, { recursive: true, force: true });
}

test.beforeEach(async () => {
  await resetReviewFixtures();
});

test.after(async () => {
  await resetReviewFixtures();

  process.env.DATABASE_URL = originalDatabaseUrl;
  process.env.DIRECT_DATABASE_URL = originalDirectDatabaseUrl;
});

test("creates a direct review with anonymous fallback and cabin-free storage", async () => {
  const review = await createPublicReview({
    reviewerName: "",
    reviewerLocation: "",
    title: "Very peaceful stay",
    body: "We had such a calm weekend by the forest and would happily come back again.",
    rating: "5",
    stayLabel: "March 2026",
    cabinId: "",
    cabinName: "",
  });

  assert.equal(review.reviewerName, "Anonymous");
  assert.equal(review.source, "direct");
  assert.deepEqual(review.imageUrls, []);

  const stored = JSON.parse(await readFile(reviewsPath, "utf8")) as Array<{
    title: string;
  }>;
  assert.equal(stored.length, 1);
  assert.equal(stored[0]?.title, "Very peaceful stay");
});

test("imports airbnb reviews and exposes them through published review queries", async () => {
  const importedCount = await importAirbnbReviews(
    JSON.stringify([
      {
        reviewerName: "Sophie",
        rating: 5,
        cabinName: "La Cedriere",
        title: "Forest reset",
        body: "The cabin felt warm, quiet, and beautifully prepared from the moment we arrived.",
        stayLabel: "February 2026",
      },
    ])
  );

  assert.equal(importedCount, 1);

  const reviews = await getPublishedReviews();
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0]?.source, "airbnb");
  assert.equal(reviews[0]?.reviewerName, "Sophie");
});

test("deletes a stored review from fallback storage", async () => {
  const review = await createPublicReview({
    reviewerName: "Camille",
    reviewerLocation: "Quebec",
    title: "Warm and easy",
    body: "Everything felt easy from arrival to departure and the place was very comfortable.",
    rating: "4",
    stayLabel: "",
    cabinId: "",
    cabinName: "",
  });

  await deleteStoredReview(review.id);

  const reviews = await getPublishedReviews();
  assert.equal(reviews.length, 0);
});

test("stores optional uploaded review photos in local free storage", async () => {
  const reviewImage = new File([Uint8Array.from([1, 2, 3, 4])], "stay-photo.jpg", {
    type: "image/jpeg",
  });

  const review = await createPublicReview(
    {
      reviewerName: "Morgan",
      reviewerLocation: "",
      title: "Lovely cabin light",
      body: "The morning light through the trees and the cozy interior made the stay memorable.",
      rating: "5",
      stayLabel: "",
      cabinId: "",
      cabinName: "",
    },
    [reviewImage]
  );

  assert.equal(review.imageUrls.length, 1);
  assert.match(review.imageUrls[0] ?? "", /^\/uploads\/reviews\//);
});
