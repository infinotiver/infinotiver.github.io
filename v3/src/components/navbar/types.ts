import type React from "react";
import type { TabId, TabItem } from "@/types/navigation";

export interface NavbarProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export interface DrawerAction {
  id: string;
  label: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}
