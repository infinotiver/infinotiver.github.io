import type React from "react";
import { Command } from "lucide-react";
import type { TabId, TabItem } from "@/types/navigation";
import { dockStyles } from "@/components/navbar/styles";

interface CollapsedDockProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onToggleDrawer: () => void;
}

const stateClass = (active: boolean) =>
  `${dockStyles.controlBase} ${active ? dockStyles.controlActive : dockStyles.controlIdle}`;

const CollapsedDock: React.FC<CollapsedDockProps> = ({ tabs, activeTab, onTabChange, onToggleDrawer }) => {
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className={dockStyles.collapsedWrap} aria-label="Collapsed dock">
      <button type="button" onClick={onToggleDrawer} className={stateClass(false)} aria-label="Open launcher">
        <Command className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onTabChange(currentTab.id)}
        className={stateClass(true)}
        aria-label={currentTab.label}
      >
        <CurrentIcon className="h-3.5 w-3.5" />
        <span>{currentTab.label}</span>
      </button>
    </div>
  );
};

export default CollapsedDock;
