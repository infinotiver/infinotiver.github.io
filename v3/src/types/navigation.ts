import type React from "react";

export type TabId = "home" | "projects" | "about";

export interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
