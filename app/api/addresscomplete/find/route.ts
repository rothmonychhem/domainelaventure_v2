import { NextResponse } from "next/server";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm")?.trim() || "";

  if (searchTerm.length < 3) {
    return NextResponse.json({ items: [] });
  }

  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set("q", searchTerm);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "ca");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "DomaineAventureCabinAdmin/1.0 (address lookup)",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const payload = (await response.json()) as Array<{
    place_id: number;
    display_name: string;
  }>;

  return NextResponse.json({
    items: payload.map((item) => ({
      Id: String(item.place_id),
      Text: item.display_name,
    })),
  });
}
