import type { ReactNode } from "react";

type AccentIcon =
  | "pine"
  | "spark"
  | "mail"
  | "shield"
  | "key"
  | "map"
  | "leaf";

const iconPaths: Record<AccentIcon, ReactNode> = {
  pine: (
    <path
      d="M12 3.5 8.8 8H11l-3.6 4.8H10l-4 5.7h12l-4-5.7h2.6L13 8h2.2L12 3.5Z"
      fill="currentColor"
    />
  ),
  spark: (
    <path
      d="m12 3.5 1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8-4.8-1.7 4.8-1.7L12 3.5Zm5.1 10.4.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"
      fill="currentColor"
    />
  ),
  mail: (
    <>
      <rect
        x="4"
        y="6.5"
        width="16"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path
        d="m5.8 8 6.2 5 6.2-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  shield: (
    <path
      d="M12 3.8c2 .9 4.2 1.5 6.4 1.8v5.3c0 4.1-2.6 7.1-6.4 9.3-3.8-2.2-6.4-5.2-6.4-9.3V5.6c2.2-.3 4.4-.9 6.4-1.8Zm0 4.1v7.1m-2.9-4.2h5.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  key: (
    <path
      d="M10.1 13.9a3.9 3.9 0 1 1 2.6-3.7H20v2.3h-1.8v1.8h-2.1v1.8H14v-1.8h-1.6a3.9 3.9 0 0 1-2.3-.4Zm-.7-3.7a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
      fill="currentColor"
    />
  ),
  map: (
    <>
      <path
        d="M5 6.2 9.3 4.5l5.4 1.6L19 4.6v13.2l-4.3 1.7-5.4-1.6L5 19.4V6.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9.3 4.6v13.3m5.4-11.8v13.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </>
  ),
  leaf: (
    <path
      d="M18.6 5.2c-6.7.1-11.4 2.8-12.3 8.7-.3 2.2.2 4.3 1 5.9 1.8-3.3 4.8-5.7 8.7-6.9-3 1.5-5.3 4-6.6 7.1 2 .9 4.3 1.1 6.4.3 5.6-2 6.5-9.5 2.8-15.1Z"
      fill="currentColor"
    />
  ),
};

export default function SectionAccent({
  icon,
  label,
  inverted = false,
}: {
  icon: AccentIcon;
  label: ReactNode;
  inverted?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className={[
          "inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_12px_24px_rgba(39,61,44,0.12)]",
          inverted
            ? "border-white/20 bg-white/12 text-[#f7e7cd]"
            : "border-[rgba(86,112,71,0.16)] bg-[rgba(246,239,225,0.92)] text-[var(--accent-dark)]",
        ].join(" ")}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          {iconPaths[icon]}
        </svg>
      </span>
      <span
        className={[
          "text-[0.72rem] font-semibold uppercase tracking-[0.24em]",
          inverted ? "text-[#ead6b5]" : "text-[rgba(48,71,46,0.72)]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}
