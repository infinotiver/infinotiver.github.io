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
  const [isHovering, setIsHovering] = useState(false);
  const activeIdentity = useMemo(
    () => identities.find((item) => item.id === activeId) ?? identities[0],
    [activeId],
  );

  return (
    <div
      className="glass-ui inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 transition-colors duration-200 md:gap-2"
      style={{ borderColor: `${activeIdentity.accent}88` }}
      onMouseLeave={() => {
        setActiveId(identities[0].id);
        setIsHovering(false);
      }}
    >
      <div className="flex items-center">
        {identities.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => {
              setActiveId(item.id);
              setIsHovering(true);
            }}
            onFocus={() => setActiveId(item.id)}
            className={`${
              idx > 0 ? "-ml-2" : ""
            } relative overflow-hidden rounded-full border-2 bg-background p-0.5 transition-transform duration-150 hover:-translate-y-0.5`}
            style={{
              borderColor: activeId === item.id ? item.accent : "transparent",
              zIndex: identities.length - idx,
            }}
          >
            {item.src ? (
              <img
                src={item.src}
                alt={item.label}
                className="h-6 w-6 rounded-full object-cover md:h-7 md:w-7"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold md:h-7 md:w-7 md:text-xs">
                {item.initials}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 items-center pr-1 leading-tight md:pr-2">
        <p
          className="w-28 font-mono text-left text-xs font-semibold transition-colors duration-200 md:w-32 md:text-sm"
          style={{ color: isHovering ? activeIdentity.accent : "var(--foreground)" }}
        >
          {activeIdentity.label}
        </p>
      </div>
    </div>
  );
};

export default UsernameChip;
