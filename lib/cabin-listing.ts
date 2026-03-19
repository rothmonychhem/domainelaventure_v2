export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildCabinSlug(input: { name: string; address: string }) {
  const base = `${input.name} ${input.address}`.trim();
  return slugify(base) || `cabin-${Date.now()}`;
}
