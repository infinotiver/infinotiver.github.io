import { AnimatePresence, motion } from "framer-motion";
import { apps, getApp } from "@/os/apps/registry";
import TitleBar from "@/os/TitleBar";
import AppGrid from "@/os/AppGrid";
import DesktopWidgets from "@/os/DesktopWidgets";
import Environment from "@/os/Environment";
import Dock from "@/os/Dock";
import useSession from "@/os/useSession";

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
  const hasMaximized = session.windows.some(
    (w) => w.windowState === "maximized",
  );
  const showDesktop = !hasMaximized;

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

      {/* ── windows layer ── */}
      <AnimatePresence>
        {session.windows.map((win) => {
          const appDef = getApp(win.id);
          const Component = appDef.component;
          const isWindowed = win.windowState === "windowed";
          const isFocused = session.focusedId === win.id;

          return (
            <motion.div
              key={win.id}
              style={{ zIndex: win.zIndex }}
              className={`fixed inset-0 pointer-events-none ${
                isWindowed
                  ? "flex items-center justify-center p-6 pb-24"
                  : "flex flex-col pb-16"
              }`}
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.99 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <motion.div
                className={`pointer-events-auto ${
                  isWindowed
                    ? "max-w-4xl w-full flex flex-col rounded-2xl border-2 border-border bg-background/85 backdrop-blur-md min-h-[50vh] max-h-[75vh] transition-all"
                    : "flex flex-1 min-h-0 w-full flex-col rounded-xl border border-border bg-background overflow-hidden"
                } ${
                  isWindowed && isFocused
                    ? "shadow-2xl shadow-black/20 border-border"
                    : ""
                } ${isWindowed && !isFocused ? "opacity-90 shadow-sm" : ""}`}
                drag={isWindowed}
                dragMomentum={false}
                dragElastic={0}
                initial={
                  isWindowed ? { x: win.offset.x, y: win.offset.y } : { x: 0, y: 0 }
                }
                animate={
                  isWindowed ? {} : { x: 0, y: 0 }
                }
                onPointerDownCapture={() => session.focus(win.id)}
              >
                <TitleBar
                  title={appDef.title}
                  windowState={win.windowState}
                  onToggleMaximize={() => session.toggleMaximize(win.id)}
                  onClose={() => session.close(win.id)}
                />
                <div
                  className={`flex-1 overflow-y-auto min-h-0 ${isWindowed ? "" : ""}`}
                >
                  <Component isActive={isFocused} />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
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
