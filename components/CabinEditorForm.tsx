"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { amenityOptions, type AmenityField } from "@/lib/amenities";
import { buildCabinSlug } from "@/lib/cabin-listing";

type ExistingMedia = {
  id: string;
  url: string;
  mediaType: string;
  isHero: boolean;
};

type CabinFormValues = {
  name: string;
  address: string;
  description: string;
  descriptionFr: string;
  price: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
} & Record<AmenityField, boolean>;

type CabinEditorFormProps = {
  action: string;
  submitLabel: string;
  initialValues?: CabinFormValues;
  initialMedia?: ExistingMedia[];
};

type MediaDraftItem =
  | {
      kind: "existing";
      id: string;
      url: string;
      mediaType: "image" | "video";
      isHero: boolean;
    }
  | {
      kind: "new";
      id: string;
      file: File;
      previewUrl: string;
      mediaType: "image" | "video";
      isHero: boolean;
    };

type AddressFindItem = {
  Id: string;
  Text: string;
};

const defaultValues: CabinFormValues = {
  name: "",
  address: "",
  description: "",
  descriptionFr: "",
  price: "",
  guests: 1,
  bedrooms: 1,
  bathrooms: 1,
  wifi: false,
  hotTub: false,
  lakeAccess: false,
  fireplace: false,
  bbq: false,
  airConditioning: false,
  fullKitchen: false,
  washerDryer: false,
  workspace: false,
  petFriendly: false,
  selfCheckIn: false,
  freeParking: false,
};

function AmenityToggle({
  name,
  label,
  description,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--line)] bg-white/70 px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--accent-dark)]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
      </div>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="h-7 w-13 rounded-full bg-stone-300 transition peer-checked:bg-[var(--pine)]" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-6" />
      </span>
    </label>
  );
}

function ensureSingleHero(items: MediaDraftItem[]) {
  const imageItems = items.filter((item) => item.mediaType === "image");

  if (imageItems.length === 0) {
    return items.map((item) => ({ ...item, isHero: false }));
  }

  let heroAssigned = false;

  return items.map((item) => {
    if (item.mediaType !== "image") {
      return { ...item, isHero: false };
    }

    if (item.isHero && !heroAssigned) {
      heroAssigned = true;
      return item;
    }

    if (!heroAssigned) {
      heroAssigned = true;
      return { ...item, isHero: true };
    }

    return { ...item, isHero: false };
  });
}

function getMediaTypeFromFile(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

function parseStoredPrice(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) {
    return "";
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount.toFixed(2) : "";
}

function normalizeMoneyInput(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, "");
  const parts = sanitized.split(".");

  if (parts.length === 1) {
    return parts[0];
  }

  const dollars = parts[0];
  const cents = parts.slice(1).join("").slice(0, 2);
  return `${dollars}.${cents}`;
}

export default function CabinEditorForm({
  action,
  submitLabel,
  initialValues,
  initialMedia = [],
}: CabinEditorFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nextIdRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [addressQuery, setAddressQuery] = useState(initialValues?.address ?? "");
  const [priceInput, setPriceInput] = useState(parseStoredPrice(initialValues?.price ?? ""));
  const [addressOptions, setAddressOptions] = useState<AddressFindItem[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressLookupMessage, setAddressLookupMessage] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaDraftItem[]>(() =>
    ensureSingleHero(
      initialMedia.map((item) => ({
        kind: "existing",
        id: item.id,
        url: item.url,
        mediaType: item.mediaType === "video" ? "video" : "image",
        isHero: item.isHero,
      }))
    )
  );

  const values = initialValues ?? defaultValues;
  const generatedSlug = useMemo(
    () => buildCabinSlug({ name: values.name || "", address: addressQuery || values.address }),
    [addressQuery, values.address, values.name]
  );

  useEffect(() => {
    const input = fileInputRef.current;

    if (!input) {
      return;
    }

    const transfer = new DataTransfer();
    for (const item of mediaItems) {
      if (item.kind === "new") {
        transfer.items.add(item.file);
      }
    }

    input.files = transfer.files;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      for (const item of mediaItems) {
        if (item.kind === "new") {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
    };
  }, [mediaItems]);

  const mediaState = useMemo(() => {
    const payload = mediaItems.reduce<
      Array<
        | { kind: "existing"; id: string; isHero: boolean }
        | { kind: "new"; fileIndex: number; isHero: boolean }
      >
    >((accumulator, item) => {
      if (item.kind === "existing") {
        accumulator.push({
          kind: "existing",
          id: item.id,
          isHero: item.isHero,
        });
        return accumulator;
      }

      const newFileIndex = accumulator.filter(
        (entry) => entry.kind === "new"
      ).length;

      accumulator.push({
        kind: "new",
        fileIndex: newFileIndex,
        isHero: item.isHero,
      });

      return accumulator;
    }, []);

    return JSON.stringify(payload);
  }, [mediaItems]);

  function appendFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (incoming.length === 0) {
      return;
    }

    setMediaItems((current) => {
      const nextItems = [
        ...current,
        ...incoming.map((file) => ({
          kind: "new" as const,
          id: `new-${nextIdRef.current++}`,
          file,
          previewUrl: URL.createObjectURL(file),
          mediaType: getMediaTypeFromFile(file),
          isHero: false,
        })),
      ];

      return ensureSingleHero(nextItems);
    });
  }

  function removeItem(id: string) {
    setMediaItems((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item?.kind === "new") {
        URL.revokeObjectURL(item.previewUrl);
      }

      return ensureSingleHero(current.filter((entry) => entry.id !== id));
    });
  }

  function moveItem(id: string, direction: -1 | 1) {
    setMediaItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return ensureSingleHero(next);
    });
  }

  function setHero(id: string) {
    setMediaItems((current) =>
      current.map((item) => ({
        ...item,
        isHero: item.mediaType === "image" && item.id === id,
      }))
    );
  }

  async function searchAddress() {
    const trimmed = addressQuery.trim();

    if (trimmed.length < 3) {
      setAddressLookupMessage("Type at least 3 characters before searching.");
      setAddressOptions([]);
      return;
    }

    setIsSearchingAddress(true);
    setAddressLookupMessage("");

    try {
      const response = await fetch(
        `/api/addresscomplete/find?searchTerm=${encodeURIComponent(trimmed)}`
      );
      const payload = (await response.json()) as { items?: AddressFindItem[] };
      const items = payload.items ?? [];

      setAddressOptions(items);
      if (items.length === 0) {
        setAddressLookupMessage("No matching Canadian addresses were found. You can still enter the address manually.");
      }
    } catch {
      setAddressOptions([]);
      setAddressLookupMessage("Address search is temporarily unavailable. You can still enter the address manually.");
    } finally {
      setIsSearchingAddress(false);
    }
  }

  return (
    <form action={action} method="POST" encType="multipart/form-data" className="mt-8 space-y-8">
      <section className="space-y-5">
        <h2 className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
          Basic listing details
        </h2>
        <input name="name" required defaultValue={values.name} placeholder="Cabin name" className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3" />

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-stone-700">
            Cabin address
          </label>
          <div className="flex gap-3">
            <input
              name="address"
              required
              value={addressQuery}
              onChange={(event) => setAddressQuery(event.target.value)}
              placeholder="Cabin address"
              autoComplete="off"
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
            <button
              type="button"
              onClick={() => void searchAddress()}
              className="shrink-0 rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
            >
              {isSearchingAddress ? "Searching..." : "Search address"}
            </button>
          </div>
          <input name="slug" value={generatedSlug} readOnly className="hidden" />

          {addressLookupMessage ? (
            <p className="text-sm leading-6 text-stone-500">{addressLookupMessage}</p>
          ) : null}

          {addressOptions.length > 0 ? (
            <div className="rounded-[1.2rem] border border-[var(--line)] bg-white p-2 shadow-[0_24px_60px_rgba(74,47,27,0.12)]">
              {addressOptions.map((option) => (
                <button
                  key={option.Id}
                  type="button"
                  onClick={() => {
                    setAddressQuery(option.Text);
                    setAddressOptions([]);
                    setAddressLookupMessage("");
                  }}
                  className="block w-full rounded-[0.9rem] px-3 py-3 text-left transition hover:bg-[#f7ecdd]"
                >
                  <p className="text-sm font-semibold text-[var(--accent-dark)]">
                    {option.Text}
                  </p>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5">
          <label className="block text-sm font-semibold text-stone-700">
            English description
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={values.description}
              placeholder="Describe the atmosphere, setting, and guest experience."
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            French description
            <textarea
              name="descriptionFr"
              rows={5}
              defaultValue={values.descriptionFr}
              placeholder="Decrivez l'ambiance, le decor et l'experience du sejour en francais."
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
            <p className="mt-2 text-sm font-normal leading-6 text-stone-500">
              Optional. If left empty, the site will reuse the English description in French mode.
            </p>
          </label>
        </div>
        <label className="block text-sm font-semibold text-stone-700">
          Price per night
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
              $
            </span>
            <input
              value={priceInput}
              onChange={(event) => setPriceInput(normalizeMoneyInput(event.target.value))}
              onBlur={() => {
                if (!priceInput) {
                  return;
                }

                const amount = Number(priceInput);
                if (Number.isFinite(amount)) {
                  setPriceInput(amount.toFixed(2));
                }
              }}
              placeholder="199.00"
              inputMode="decimal"
              className="w-full rounded-[1.2rem] border border-[var(--line)] bg-white pl-8 pr-4 py-3"
            />
            <input name="price" value={priceInput} readOnly className="hidden" />
          </div>
        </label>
        <div className="grid gap-5 md:grid-cols-3">
          <label className="block text-sm font-semibold text-stone-700">
            Guests
            <input
              name="guests"
              required
              type="number"
              min={1}
              defaultValue={values.guests}
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Bedrooms
            <input
              name="bedrooms"
              required
              type="number"
              min={1}
              defaultValue={values.bedrooms}
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </label>
          <label className="block text-sm font-semibold text-stone-700">
            Bathrooms
            <input
              name="bathrooms"
              required
              type="number"
              min={1}
              defaultValue={values.bathrooms}
              className="mt-2 w-full rounded-[1.2rem] border border-[var(--line)] bg-white px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
            Amenities and features
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Choose which amenities are available in this chalet, similar to a listing setup on Airbnb.
          </p>
        </div>

        <div className="grid gap-4">
          {amenityOptions.map((amenity) => (
            <AmenityToggle
              key={amenity.name}
              {...amenity}
              defaultChecked={values[amenity.name]}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
            Photos and videos
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Drag files here or open them from your computer. You can reorder them and choose the hero image that will appear on cabin cards.
          </p>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            appendFiles(event.dataTransfer.files);
          }}
          className={`rounded-[1.6rem] border-2 border-dashed px-6 py-10 text-center transition ${
            isDragging
              ? "border-[var(--accent)] bg-[#f7ecdd]"
              : "border-[var(--line)] bg-white/65"
          }`}
        >
          <p className="font-heading text-2xl font-semibold text-[var(--accent-dark)]">
            Drop media files here
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Supports images and videos. The hero image should be a photo, since it will be used on listing cards.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 rounded-full bg-[var(--accent-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
          >
            Choose files from computer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            name="mediaFiles"
            multiple
            accept="image/*,video/*"
            onChange={(event) => {
              if (event.target.files) {
                appendFiles(event.target.files);
              }
            }}
            className="hidden"
          />
          <input type="hidden" name="mediaState" value={mediaState} />
        </div>

        <div className="grid gap-4">
          {mediaItems.length === 0 ? (
            <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/70 px-5 py-6 text-sm leading-6 text-stone-600">
              No media added yet. Add at least one image so the chalet has a proper hero picture.
            </div>
          ) : (
            mediaItems.map((item, index) => {
              const isImage = item.mediaType === "image";
              const previewUrl = item.kind === "existing" ? item.url : item.previewUrl;

              return (
                <div
                  key={item.id}
                  className="grid gap-4 rounded-[1.5rem] border border-[var(--line)] bg-white/75 p-4 md:grid-cols-[180px_1fr]"
                >
                  <div className="overflow-hidden rounded-[1.2rem] bg-stone-100">
                    {isImage ? (
                      <Image
                        src={previewUrl}
                        alt=""
                        width={720}
                        height={480}
                        unoptimized
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        className="h-40 w-full object-cover"
                        controls
                        muted
                      />
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        <span>{item.mediaType}</span>
                        <span>Position {index + 1}</span>
                        {item.isHero ? (
                          <span className="rounded-full bg-[var(--pine)] px-3 py-1 text-white">
                            Hero image
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-stone-600">
                        {item.kind === "existing"
                          ? "Already saved on this cabin."
                          : `New file: ${item.file.name}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, -1)}
                        className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-stone-700"
                      >
                        Move up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 1)}
                        className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-stone-700"
                      >
                        Move down
                      </button>
                      {isImage ? (
                        <button
                          type="button"
                          onClick={() => setHero(item.id)}
                          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-stone-700"
                        >
                          Set as hero
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <button className="rounded-full bg-[var(--accent-dark)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--accent)]">
        {submitLabel}
      </button>
    </form>
  );
}
