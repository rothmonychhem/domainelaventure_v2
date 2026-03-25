"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MediaItem = {
  id: string;
  url: string;
  mediaType: string;
  isHero: boolean;
};

type CabinDetailGalleryProps = {
  cabinName: string;
  mediaItems: MediaItem[];
};

function sortGalleryItems(items: MediaItem[]) {
  return [...items].sort((left, right) => {
    if (left.isHero !== right.isHero) {
      return Number(right.isHero) - Number(left.isHero);
    }

    if (left.mediaType !== right.mediaType) {
      return left.mediaType === "image" ? -1 : 1;
    }

    return left.id.localeCompare(right.id);
  });
}

export default function CabinDetailGallery({
  cabinName,
  mediaItems,
}: CabinDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const orderedItems = useMemo(() => sortGalleryItems(mediaItems), [mediaItems]);
  const previewItems = orderedItems.slice(0, 5);
  const activeItem = activeIndex === null ? null : orderedItems[activeIndex];
  const safeActiveIndex = activeIndex ?? 0;

  function openItem(index: number | null) {
    setActiveIndex(index);
    setZoomLevel(1);
  }

  return (
    <>
      <section className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/72 shadow-[0_24px_60px_rgba(39,61,44,0.1)]">
        <div className="grid gap-2 p-2 md:grid-cols-[1.35fr_1fr]">
          <button
            type="button"
            onClick={() => openItem(0)}
            className="group relative min-h-[20rem] overflow-hidden rounded-[1.4rem] md:min-h-[32rem]"
          >
            {previewItems[0]?.mediaType === "video" ? (
              <video
                src={previewItems[0].url}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                muted
              />
            ) : (
              <Image
                src={previewItems[0]?.url ?? ""}
                alt={cabinName}
                fill
                unoptimized
                sizes="(min-width: 768px) 65vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            )}
          </button>

          <div className="grid gap-2 sm:grid-cols-2">
            {previewItems.slice(1).map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(index + 1)}
                className="group relative min-h-[9.5rem] overflow-hidden rounded-[1.4rem] sm:min-h-[15.65rem]"
              >
                {item.mediaType === "video" ? (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    muted
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={`${cabinName} preview ${index + 2}`}
                    fill
                    unoptimized
                    sizes="(min-width: 768px) 32vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                )}
                {index === Math.min(3, previewItems.length - 2) ? (
                  <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(20,24,20,0.8)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    Show all
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeItem ? (
        <div className="fixed inset-0 z-[90] bg-[rgba(13,18,14,0.9)] px-4 py-6 backdrop-blur-md md:px-8">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-4 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
                  Gallery
                </p>
                <p className="font-heading mt-2 text-3xl font-semibold">
                  {cabinName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openItem(null)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex flex-wrap gap-2">
                {activeItem.mediaType === "image" ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setZoomLevel((current) => Math.max(1, current - 0.5))
                      }
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Zoom out
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setZoomLevel((current) => Math.min(3, current + 0.5))
                      }
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Zoom in
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Reset
                    </button>
                  </>
                ) : null}
              </div>

              <a
                href={activeItem.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                {activeItem.mediaType === "image" ? "Open original" : "Open video file"}
              </a>
            </div>

            <div className="relative flex-1 overflow-auto rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)]">
              {activeItem.mediaType === "video" ? (
                <video
                  src={activeItem.url}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <div
                  className="relative flex min-h-full min-w-full items-center justify-center p-4 md:p-8"
                  style={{
                    minWidth: `${zoomLevel * 100}%`,
                    minHeight: `${zoomLevel * 100}%`,
                  }}
                >
                  <Image
                    src={activeItem.url}
                    alt={`${cabinName} photo ${safeActiveIndex + 1}`}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              )}

              {orderedItems.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      openItem(
                        safeActiveIndex === 0
                          ? orderedItems.length - 1
                          : safeActiveIndex - 1
                      )
                    }
                    className="absolute left-4 top-1/2 rounded-full bg-[rgba(12,15,13,0.72)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[rgba(12,15,13,0.9)]"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openItem(
                        safeActiveIndex === orderedItems.length - 1
                          ? 0
                          : safeActiveIndex + 1
                      )
                    }
                    className="absolute right-4 top-1/2 rounded-full bg-[rgba(12,15,13,0.72)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[rgba(12,15,13,0.9)]"
                  >
                    Next
                  </button>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {orderedItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openItem(index)}
                  className={`relative h-18 w-24 overflow-hidden rounded-[1rem] border transition ${
                    index === safeActiveIndex
                      ? "border-white"
                      : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.mediaType === "video" ? (
                    <video src={item.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
