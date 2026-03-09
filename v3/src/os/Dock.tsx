import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, Pin, PinOff } from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import type { AppDefinition, AppId } from "@/os/apps/types";

/* ── dock style tokens ── */
const style = {
  base: "glass-ui flex h-8 shrink-0 items-center gap-1.5 rounded-full border-white/25 !bg-black/85 px-2.5 text-xs !text-white transition-colors",
  idle: "hover:border-white/45 hover:!bg-black/75 hover:!text-white",
  active: "border-white/65 bg-black! !text-white ring-1 ring-white/30",
  rail: "glass-ui flex items-center gap-1 overflow-x-auto rounded-full border-white/20 !bg-black/80 p-1",
  wrap: "flex items-center gap-1 p-1",
  pill: "glass-ui flex h-8 w-12 items-center justify-center rounded-full border-white/30 !bg-black/85 text-white/90 transition-colors hover:border-white/45 hover:!bg-black hover:text-white",
} as const;

const btn = (active: boolean) =>
  `${style.base} ${active ? style.active : style.idle}`;

interface DockProps {
  apps: AppDefinition[];
  activeAppId: AppId | null;
  onShowDesktop: () => void;
  onOpenApp: (id: AppId) => void;
}

const Dock = ({ apps, activeAppId, onShowDesktop, onOpenApp }: DockProps) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const expanded = isMobile || pinned || hovered;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <motion.nav
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={style.wrap}
            >
              <div className={style.rail}>
                {apps.map((app) => {
                  const Icon = app.icon;
                  const isActive = activeAppId === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() =>
                        isActive ? onShowDesktop() : onOpenApp(app.id)
                      }
                      className={btn(isActive)}
                      aria-label={isActive ? `Close ${app.title}` : app.title}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">{app.title}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPinned((p) => !p)}
                className={btn(pinned)}
                aria-label={pinned ? "Unpin dock" : "Pin dock"}
              >
                {pinned ? (
                  <PinOff className="h-3.5 w-3.5" />
                ) : (
                  <Pin className="h-3.5 w-3.5" />
                )}
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={style.pill}
              onMouseEnter={() => setHovered(true)}
              onFocus={() => setHovered(true)}
              onClick={() => setPinned(true)}
              aria-label="Expand dock"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Dock;
