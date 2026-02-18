import type React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { TabId } from "@/types/navigation";
import type { DrawerAction } from "@/components/navbar/types";
import { dockStyles } from "@/components/navbar/styles";

interface LauncherDrawerProps {
  activeTab: TabId;
  query: string;
  onQueryChange: (value: string) => void;
  actions: DrawerAction[];
  searchRef: React.RefObject<HTMLInputElement | null>;
}

const LauncherDrawer: React.FC<LauncherDrawerProps> = ({
  activeTab,
  query,
  onQueryChange,
  actions,
  searchRef,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.985 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={dockStyles.drawer}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/65">Launcher</p>
        <p className="text-[10px] text-white/50">{activeTab}</p>
      </div>

      <div className={dockStyles.searchWrap}>
        <Search className="h-3.5 w-3.5 text-white/70" />
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search actions..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
        />
      </div>

      <div className="grid gap-1.5 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.id} type="button" onClick={action.onSelect} className={dockStyles.actionBtn}>
              <Icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          );
        })}
        {actions.length === 0 && (
          <div className="rounded-lg border border-white/15 px-2.5 py-1.5 text-sm text-white/60 md:col-span-2">
            No results
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default LauncherDrawer;
