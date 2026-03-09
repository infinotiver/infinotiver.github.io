import { useMemo, useState } from "react";
import { getApp } from "@/os/apps/registry";
import type { AppDefinition, AppId } from "@/os/apps/types";

export type WindowState = "maximized" | "windowed";

interface Session {
  selectedId: AppId | null;
  openAppId: AppId | null;
  openApp: AppDefinition | null;
  windowState: WindowState;
  select: (id: AppId) => void;
  open: (id: AppId) => void;
  close: () => void;
  toggleMaximize: () => void;
}

const useSession = (): Session => {
  const [selectedId, setSelectedId] = useState<AppId | null>(null);
  const [openAppId, setOpenAppId] = useState<AppId | null>(null);
  const [windowState, setWindowState] = useState<WindowState>("maximized");

  const openApp = useMemo(
    () => (openAppId ? getApp(openAppId) : null),
    [openAppId],
  );

  return {
    selectedId,
    openAppId,
    openApp,
    windowState,
    select: (id) => setSelectedId(id),
    open: (id) => {
      setSelectedId(id);
      setOpenAppId(id);
      if (openAppId !== id) setWindowState("maximized");
    },
    close: () => {
      setOpenAppId(null);
      setWindowState("maximized");
    },
    toggleMaximize: () =>
      setWindowState((s) => (s === "maximized" ? "windowed" : "maximized")),
  };
};

export default useSession;
