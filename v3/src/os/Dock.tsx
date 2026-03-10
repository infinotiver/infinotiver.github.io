import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, Pin, PinOff } from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import type { AppDefinition, AppId } from "@/os/apps/types";

/* ── dock style tokens ── */
const style = {
  base: "glass-ui flex h-10 shrink-0 items-center gap-2 rounded-full !bg-black/85 px-4 text-sm !text-white transition-colors border-2",
  idle: "border-white/30 !bg-transparent !text-white/70 hover:!text-white hover:border-white/50",
  active: "border-white !bg-white/15 !text-white",
  rail: "glass-ui flex items-center gap-2 overflow-x-auto rounded-full border border-white/20 !bg-black/80 p-1.5",
  wrap: "flex items-center gap-2 p-1",
  pill: "glass-ui flex h-10 w-14 items-center justify-center rounded-full border border-white/20 !bg-black/85 text-white/90 transition-colors hover:border-white/40 hover:!bg-black hover:text-white",
} as const;

const btn = (active: boolean) =>
  `${style.base} ${active ? style.active : style.idle}`;

interface DockProps {
  apps: AppDefinition[];
  activeAppId: AppId | null;
  onShowDesktop: () => void;
  onOpenApp: (id: AppId) => void;
}

const HIDE_DELAY = 600;

const Dock = ({ apps, activeAppId, onShowDesktop, onOpenApp }: DockProps) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const expanded = isMobile || pinned || hovered;

  const handleMouseEnter = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setHovered(false), HIDE_DELAY);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <motion.nav
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
                      <Icon className="h-4 w-4 shrink-0" />
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
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
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
              onMouseEnter={handleMouseEnter}
              onFocus={() => setHovered(true)}
              onClick={() => setPinned(true)}
              aria-label="Expand dock"
            >
              <ChevronUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Dock;
