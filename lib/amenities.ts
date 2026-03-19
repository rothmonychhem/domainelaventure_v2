export const amenityFields = [
  "wifi",
  "hotTub",
  "lakeAccess",
  "fireplace",
  "bbq",
  "airConditioning",
  "fullKitchen",
  "washerDryer",
  "workspace",
  "petFriendly",
  "selfCheckIn",
  "freeParking",
] as const;

export type AmenityField = (typeof amenityFields)[number];

export const amenityOptions: Array<{
  name: AmenityField;
  label: string;
  description: string;
}> = [
  {
    name: "wifi",
    label: "Wifi",
    description: "Reliable internet connection for browsing, streaming, or remote work.",
  },
  {
    name: "hotTub",
    label: "Hot tub",
    description: "Private spa or hot tub available for guests during their stay.",
  },
  {
    name: "lakeAccess",
    label: "Lake access",
    description: "Direct or nearby access to the lake, dock, or water views.",
  },
  {
    name: "fireplace",
    label: "Fireplace",
    description: "Indoor fireplace or wood stove for a warm chalet atmosphere.",
  },
  {
    name: "bbq",
    label: "BBQ grill",
    description: "Outdoor barbecue setup for guest meals and summer evenings.",
  },
  {
    name: "airConditioning",
    label: "Air conditioning",
    description: "Cooling available for warmer summer stays.",
  },
  {
    name: "fullKitchen",
    label: "Full kitchen",
    description: "Kitchen equipped for real meal prep, not just light snacks.",
  },
  {
    name: "washerDryer",
    label: "Washer and dryer",
    description: "Laundry machines available inside the chalet or unit.",
  },
  {
    name: "workspace",
    label: "Dedicated workspace",
    description: "Comfortable desk or work area suitable for a laptop setup.",
  },
  {
    name: "petFriendly",
    label: "Pet friendly",
    description: "Guests may bring approved pets according to your house rules.",
  },
  {
    name: "selfCheckIn",
    label: "Self check-in",
    description: "Guests can access the property without an in-person arrival.",
  },
  {
    name: "freeParking",
    label: "Free parking",
    description: "On-site parking available for guest vehicles at no extra cost.",
  },
];

export function getAmenitiesFromFormData(formData: FormData) {
  return Object.fromEntries(
    amenityFields.map((field) => [field, formData.get(field) === "on"])
  ) as Record<AmenityField, boolean>;
}
