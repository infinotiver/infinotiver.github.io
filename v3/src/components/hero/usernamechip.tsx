import React, { useMemo, useState } from "react";
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
  const activeIdentity = useMemo(
    () => identities.find((item) => item.id === activeId) ?? identities[0],
    [activeId],
  );

  return (
    <div
      className="glass-ui relative inline-flex max-w-full items-center gap-1.5 rounded-full px-1.5 py-1 transition-colors duration-200"
      style={{ borderColor: `${activeIdentity.accent}70` }}
      onMouseLeave={() => setActiveId(identities[0].id)}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-60"
        style={{
          background: `linear-gradient(135deg, ${activeIdentity.accent}20, transparent 55%)`,
        }}
      />

      <div className="relative z-10 flex items-center rounded-full">
        {identities.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => setActiveId(item.id)}
            onFocus={() => setActiveId(item.id)}
            className={`${idx > 0 ? "-ml-2" : ""} relative overflow-hidden rounded-full border-2 bg-background p-0.5 `}
            style={{
              borderColor: activeId === item.id ? item.accent : "transparent",
              zIndex: identities.length - idx,
            }}
          >
            {item.src ? (
              <img
                src={item.src}
                alt={item.label}
                className="h-5 w-5 rounded-full object-cover md:h-6 md:w-6"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold md:h-6 md:w-6 md:text-[10px]">
                {item.initials}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex min-w-0 items-center gap-1 pr-0.5 leading-tight">
        <span
          className="h-1 w-1 rounded-full"
          style={{ backgroundColor: activeIdentity.accent }}
          aria-hidden="true"
        />
        <p
          className="w-24 text-left font-mono text-xs font-semibold text-foreground transition-colors duration-200 md:w-28 md:text-sm"
          style={{ color: activeId === identities[0].id ? "var(--foreground)" : activeIdentity.accent }}
        >
          {activeIdentity.label}
        </p>
      </div>
    </div>
  );
};

export default UsernameChip;
