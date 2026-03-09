import { useCallback, useMemo, useState } from "react";
import { getApp } from "@/os/apps/registry";
import type { AppId } from "@/os/apps/types";

export type WindowState = "maximized" | "windowed";

export interface WindowEntry {
  id: AppId;
  windowState: WindowState;
  zIndex: number;
  offset: { x: number; y: number };
}

interface Session {
  selectedId: AppId | null;
  windows: WindowEntry[];
  focusedId: AppId | null;
  openAppIds: AppId[];
  select: (id: AppId) => void;
  open: (id: AppId) => void;
  close: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  focus: (id: AppId) => void;
}

let zCounter = 10;

const useSession = (): Session => {
  const [selectedId, setSelectedId] = useState<AppId | null>(null);
  const [windows, setWindows] = useState<WindowEntry[]>([]);

  // Derived: window with highest zIndex is focused
  const focusedId = useMemo<AppId | null>(() => {
    if (windows.length === 0) return null;
    return windows.reduce((best, w) => (w.zIndex > best.zIndex ? w : best)).id;
  }, [windows]);

  const openAppIds = useMemo(() => windows.map((w) => w.id), [windows]);

  const focus = useCallback((id: AppId) => {
    zCounter += 1;
    const z = zCounter;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
    );
  }, []);

  const open = useCallback((id: AppId) => {
    // Validate app exists
    getApp(id);
    setSelectedId(id);
    zCounter += 1;
    const z = zCounter;
    const offset = {
      x: Math.round((Math.random() - 0.5) * 160),
      y: Math.round((Math.random() - 0.5) * 80),
    };
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        // Already open — just bring to front
        return prev.map((w) => (w.id === id ? { ...w, zIndex: z } : w));
      }
      return [...prev, { id, windowState: "windowed", zIndex: z, offset }];
    });
  }, []);

  const close = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              windowState:
                w.windowState === "maximized" ? "windowed" : "maximized",
            }
          : w,
      ),
    );
  }, []);

  return {
    selectedId,
    windows,
    focusedId,
    openAppIds,
    select: setSelectedId,
    open,
    close,
    toggleMaximize,
    focus,
  };
};

export default useSession;
