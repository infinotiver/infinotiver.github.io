import { AnimatePresence, motion } from "framer-motion";
import { apps, getApp } from "@/os/apps/registry";
import TitleBar from "@/os/TitleBar";
import AppGrid from "@/os/AppGrid";
import DesktopWidgets from "@/os/DesktopWidgets";
import Environment from "@/os/Environment";
import Dock from "@/os/Dock";
import useSession, { type WindowEntry } from "@/os/useSession";
import type { AppId } from "@/os/apps/types";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

/* ── Spring pop-in variant ── */
const popIn = {
  initial: { opacity: 0, y: 18, scale: 0.93 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 26 },
  },
};

/* ── Desktop (shown when no maximized window) ── */
interface DesktopProps {
  selectedId: AppId | null;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
}
const Desktop = ({ selectedId, onSelect, onOpen }: DesktopProps) => (
  <motion.div
    className="flex flex-col gap-6 lg:flex-row lg:gap-10"
    initial="initial"
    animate="animate"
    variants={{
      animate: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
    }}
  >
    <motion.div variants={popIn} className="flex-1 space-y-6">
      <motion.div variants={popIn} className="space-y-1.5">
        <h1 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl md:text-6xl">
          {getGreeting()}
        </h1>
        <p className="text-sm font-semibold text-muted-foreground md:text-lg">
          {formatDate()}
        </p>
      </motion.div>
      <motion.div variants={popIn}>
        <AppGrid
          apps={apps}
          selectedId={selectedId}
          onSelect={onSelect}
          onOpen={onOpen}
        />
      </motion.div>
    </motion.div>
    <motion.aside
      variants={popIn}
      className="hidden shrink-0 lg:block lg:w-72 xl:w-80"
    >
      <DesktopWidgets />
    </motion.aside>
  </motion.div>
);

/* ── AppWindow (one per open window) ── */
interface AppWindowProps {
  win: WindowEntry;
  isFocused: boolean;
  onFocus: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}
const AppWindow = ({
  win,
  isFocused,
  onFocus,
  onToggleMaximize,
  onClose,
}: AppWindowProps) => {
  const appDef = getApp(win.id);
  const Component = appDef.component;
  const isWindowed = win.windowState === "windowed";

  return (
    <motion.div
      style={{ zIndex: win.zIndex }}
      className={`fixed inset-0 pointer-events-none ${
        isWindowed
          ? "flex items-center justify-center p-6 pb-24"
          : "flex flex-col p-6"
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.99 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        className={`pointer-events-auto h-full ${
          isWindowed
            ? "max-w-4xl w-full flex flex-col rounded-2xl border-2 border-border bg-background/85 backdrop-blur-md min-h-[50vh] max-h-[75vh] transition-all"
            : "flex flex-1 min-h-0 w-full flex-col rounded-xl border border-border bg-background overflow-hidden"
        } ${isWindowed && isFocused ? "shadow-2xl shadow-black/20" : ""} ${
          isWindowed && !isFocused ? "opacity-90 shadow-sm" : ""
        }`}
        drag={isWindowed}
        dragMomentum={false}
        dragElastic={0}
        initial={
          isWindowed ? { x: win.offset.x, y: win.offset.y } : { x: 0, y: 0 }
        }
        animate={isWindowed ? {} : { x: 0, y: 0 }}
        onPointerDownCapture={onFocus}
      >
        <TitleBar
          title={appDef.title}
          windowState={win.windowState}
          onToggleMaximize={onToggleMaximize}
          onClose={onClose}
        />
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col rounded-[inherit]">
          <Component isActive={isFocused} />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Shell ── */
const Shell = () => {
  const session = useSession();
  const hasMaximized = session.windows.some(
    (w) => w.windowState === "maximized",
  );

  return (
    <Environment>
      <div className="relative z-0 h-full w-full">
        {!hasMaximized && (
          <div className="relative z-0 h-full overflow-y-auto px-6 py-6 pb-20 md:px-12 md:py-10 md:pb-20">
            <Desktop
              selectedId={session.selectedId}
              onSelect={session.select}
              onOpen={session.open}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {session.windows.map((win) => (
          <AppWindow
            key={win.id}
            win={win}
            isFocused={session.focusedId === win.id}
            onFocus={() => session.focus(win.id)}
            onToggleMaximize={() => session.toggleMaximize(win.id)}
            onClose={() => session.close(win.id)}
          />
        ))}
      </AnimatePresence>

      <Dock
        apps={apps}
        activeAppId={session.focusedId}
        onShowDesktop={() => {
          if (session.focusedId) session.close(session.focusedId);
        }}
        onOpenApp={session.open}
      />
    </Environment>
  );
};

export default Shell;
