import type { TabId, TabItem } from "@/types/navigation";

export interface NavbarProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}
