import { AnimatePresence, motion } from "framer-motion";
import { apps } from "@/os/apps/registry";
import TitleBar from "@/os/TitleBar";
import AppGrid from "@/os/AppGrid";
import DesktopWidgets from "@/os/DesktopWidgets";
import Environment from "@/os/Environment";
import Dock from "@/os/Dock";
import useSession from "@/os/useSession";

const windowClass = {
  maximized:
    "flex h-full w-full flex-col rounded-2xl border border-border bg-background overflow-hidden",
  windowed:
    "max-w-4xl w-full rounded-2xl border-2 border-border bg-background/50 p-4 backdrop-blur-sm min-h-[50vh] max-h-[75vh] overflow-y-auto",
} as const;

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

const Shell = () => {
  const session = useSession();
  const ActiveComponent = session.openApp?.component;
  const showDesktop = !session.openApp || session.windowState === "windowed";
  const isWindowed = session.windowState === "windowed";

  return (
    <Environment>
      {showDesktop && (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* ── left: greeting + apps ── */}
          <div className="flex-1 space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-4xl font-black tracking-tighter text-foreground md:text-6xl">
                {getGreeting()}
              </h1>
              <p className="text-base font-semibold text-muted-foreground md:text-lg">
                {formatDate()}
              </p>
            </div>

            <div className="space-y-2">
              <AppGrid
                apps={apps}
                selectedId={session.selectedId}
                onSelect={session.select}
                onOpen={session.open}
              />
            </div>
          </div>

          {/* ── right: widgets sidebar ── */}
          <aside className="w-full shrink-0 lg:w-72 xl:w-80">
            <DesktopWidgets />
          </aside>
        </div>
      )}

      <AnimatePresence mode="wait">
        {session.openApp && ActiveComponent && (
          <div
            className={
              isWindowed
                ? "absolute inset-0 z-30 flex items-start justify-center pt-8 pointer-events-none"
                : "absolute inset-0 z-30 flex items-center justify-center p-4 pb-20"
            }
          >
            <motion.div
              key={`${session.openApp.id}-${session.windowState}`}
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`${windowClass[session.windowState]} ${isWindowed ? "pointer-events-auto" : ""}`}
              drag={isWindowed}
              dragMomentum={false}
              dragElastic={0}
            >
              <TitleBar
                title={session.openApp.title}
                windowState={session.windowState}
                onToggleMaximize={session.toggleMaximize}
                onClose={session.close}
              />
              <div
                className={`pt-1 ${!isWindowed ? "flex-1 overflow-y-auto" : ""}`}
              >
                <ActiveComponent isActive />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Dock
        apps={apps}
        activeAppId={session.openAppId}
        onShowDesktop={session.close}
        onOpenApp={session.open}
      />
    </Environment>
  );
};

export default Shell;
