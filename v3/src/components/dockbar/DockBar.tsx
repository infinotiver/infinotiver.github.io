import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";

interface DockBarProps {
  activeLabel: string;
}

const itemClass =
  "glass-ui inline-flex h-6 items-center rounded-full border border-white/25 !bg-black/85 px-3 text-xs !text-white/95 transition-colors hover:!bg-black";

const iconButtonClass =
  "glass-ui inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/25 !bg-black/85 text-white/95 transition-colors hover:bg-black";

const DockBar: React.FC<DockBarProps> = ({ activeLabel }) => {
  const [align, setAlign] = useState<"left" | "right">("left");

  return (
    <div className={`fixed bottom-4 z-40 ${align === "left" ? "left-4" : "right-4"}`}>
      <div className="flex items-center gap-1 rounded-full  p-1">
        <div className={itemClass}>Workspace: {activeLabel}</div>
        <a className={itemClass} href="https://github.com/infinotiver" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <button
          type="button"
          onClick={() => setAlign((prev) => (prev === "left" ? "right" : "left"))}
          className={iconButtonClass}
          aria-label={`Move dock bar to ${align === "left" ? "right" : "left"}`}
          title="Toggle dock bar alignment"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DockBar;
