import type React from "react";
import { Pin, PinOff } from "lucide-react";
import type { TabId, TabItem } from "@/types/navigation";
import { dockStyles } from "@/components/navbar/styles";

interface ExpandedDockProps {
  tabs: TabItem[];
  activeTab: TabId;
  isMobile: boolean;
  pinned: boolean;
  onTabChange: (tab: TabId) => void;
  onTogglePin: () => void;
}

const stateClass = (active: boolean) =>
  `${dockStyles.controlBase} ${active ? dockStyles.controlActive : dockStyles.controlIdle}`;

const ExpandedDock: React.FC<ExpandedDockProps> = ({
  tabs,
  activeTab,
  isMobile,
  pinned,
  onTabChange,
  onTogglePin,
}) => {
  return (
    <div className={dockStyles.expandedWrap}>
      <div className={dockStyles.rail}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={stateClass(isActive)}
            >
              <Icon className="h-3.5 w-3.5" />
              {!isMobile && <span className="hidden md:inline">{tab.label}</span>}
            </button>
          );
        })}
      </div>

      {!isMobile && (
        <button
          type="button"
          onClick={onTogglePin}
          className={stateClass(pinned)}
          aria-label={pinned ? "Unpin dock" : "Pin dock"}
        >
          {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
};

export default ExpandedDock;
