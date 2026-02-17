import type React from "react";
import { dockStyles } from "@/components/navbar/styles";

interface CollapsedDockProps {
  onExpand: () => void;
}

const CollapsedDock: React.FC<CollapsedDockProps> = ({ onExpand }) => {
  return (
    <button type="button" onClick={onExpand} className={dockStyles.collapsedButton} aria-label="Open dock">
      <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/25 to-white/10 opacity-70 transition group-hover:opacity-100" />
      <span className="absolute inset-y-[3px] left-[10px] right-[10px] rounded-full border border-white/20" />
    </button>
  );
};

export default CollapsedDock;
