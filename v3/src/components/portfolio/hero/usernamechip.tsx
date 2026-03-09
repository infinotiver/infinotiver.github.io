import React, { useState } from "react";
import logo_new from "@/assets/assets/logo_new.png";
import logo from "@/assets/assets/logo.png";

export interface ChipIdentity {
  id: string;
  label: string;
  accent: string;
  src?: string;
  initials: string;
}

export const identities: ChipIdentity[] = [
  {
    id: "infinotiver",
    label: "@infinotiver",
    accent: "#3b82f6",
    src: logo_new,
    initials: "I",
  },
  {
    id: "karret",
    label: "@karret",
    accent: "#f97316",
    src: logo,
    initials: "K",
  },
];

interface UsernameChipProps {
  onActiveIdentityChange?: (identity: ChipIdentity) => void;
}

const UsernameChip: React.FC<UsernameChipProps> = ({ onActiveIdentityChange }) => {
  const [activeId, setActiveId] = useState(identities[0].id);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const activeIdentity =
    identities.find((item) => item.id === activeId) ?? identities[0];

  return (
    <div
      className="relative inline-flex max-w-full items-center rounded-full px-1.5 py-1 transition-colors duration-200"
      style={{ borderColor: `${activeIdentity.accent}70` }}
      onMouseLeave={() => {
        setActiveId(identities[0].id);
        setTooltipId(null);
        onActiveIdentityChange?.(identities[0]);
      }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full  opacity-60" />

      <div className="relative z-10 flex items-center rounded-full">
        {identities.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => {
              setActiveId(item.id);
              setTooltipId(item.id);
              onActiveIdentityChange?.(item);
            }}
            onMouseLeave={() => setTooltipId(null)}
            onFocus={() => {
              setActiveId(item.id);
              setTooltipId(item.id);
              onActiveIdentityChange?.(item);
            }}
            onBlur={() => setTooltipId(null)}
            className={`${idx > 0 ? "-ml-4" : ""} ${
              idx === 0 ? "z-60" : "z-10"
            } relative overflow-visible rounded-full border-3 bg-background p-0.5 transition-transform duration-150 hover:-translate-y-0.5 ${
              activeId === item.id
                ? "shadow-[0_0_0_2px_rgba(255,255,255,0.15)]"
                : "border-3 border-black"
            }`}
            style={
              activeId === item.id ? { borderColor: item.accent } : undefined
            }
            aria-label={item.label}
          >
            {tooltipId === item.id && (
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-background/90 px-1.5 py-0.5 text-[12px] font-semibold text-foreground shadow-sm">
                {item.label}
              </span>
            )}
            {item.src ? (
              <img
                src={item.src}
                alt={item.label}
                className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-[10px] font-bold md:h-12 md:w-12 md:text-xs">
                {item.initials}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UsernameChip;
