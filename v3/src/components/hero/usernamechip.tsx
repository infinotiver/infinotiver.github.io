import React, { useState } from "react";
import logo from "@/assets/assets/logo.png";

interface ChipIdentity {
  id: string;
  label: string;
  accent: string;
  src?: string;
  initials: string;
}

const identities: ChipIdentity[] = [
  {
    id: "infinotiver",
    label: "@infinotiver",
    accent: "#3b82f6",
    src: logo,
    initials: "I",
  },
  {
    id: "karret",
    label: "@karret",
    accent: "#f97316",
    initials: "K",
  },
];

const UsernameChip: React.FC = () => {
  const [activeId, setActiveId] = useState(identities[0].id);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const activeIdentity = identities.find((item) => item.id === activeId) ?? identities[0];

  return (
    <div
      className="relative inline-flex max-w-full items-center rounded-full px-1.5 py-1 transition-colors duration-200"
      style={{ borderColor: `${activeIdentity.accent}70` }}
      onMouseLeave={() => {
        setActiveId(identities[0].id);
        setTooltipId(null);
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
            }}
            onMouseLeave={() => setTooltipId(null)}
            onFocus={() => {
              setActiveId(item.id);
              setTooltipId(item.id);
            }}
            onBlur={() => setTooltipId(null)}
            className={`${idx > 0 ? "-ml-2" : ""} ${
              idx === 0 ? "z-20" : "z-10"
            } relative overflow-visible rounded-full border-2 bg-background p-0.5 transition-transform duration-150 hover:-translate-y-0.5 ${
              activeId === item.id ? "shadow-[0_0_0_2px_rgba(255,255,255,0.15)]" : "border-transparent"
            }`}
            style={activeId === item.id ? { borderColor: item.accent } : undefined}
            aria-label={item.label}
          >
            {tooltipId === item.id && (
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
                {item.label}
              </span>
            )}
            {item.src ? (
              <img
                src={item.src}
                alt={item.label}
                className="h-7 w-7 rounded-full object-cover md:h-8 md:w-8"
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold md:h-8 md:w-8 md:text-xs">
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
