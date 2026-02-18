import React, { useState } from "react";
import "./index.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Noise from "@/components/Noise";
import { tabs } from "@/config/navigation";
import type { TabId } from "@/types/navigation";
import WorkspaceContent from "@/components/workspace/WorkspaceContent";
import QuickHubModal from "@/components/home/QuickHubModal";
import DockBar from "@/components/dockbar/DockBar";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [homeHubOpen, setHomeHubOpen] = useState(false);

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "Home";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background px-3 py-4 text-foreground md:px-8 md:py-8">
      <Noise
        patternSize={200}
        patternScaleX={2}
        patternScaleY={2}
        patternRefreshInterval={2}
        patternAlpha={20}
      />
      <div className="relative z-10 mx-auto min-h-[calc(100vh-6rem)] w-full max-w-7xl pb-24 pt-3 md:min-h-[calc(100vh-4.5rem)] md:pb-18 md:pt-4">
        <main>
          <WorkspaceContent
            activeTab={activeTab}
            onOpenQuickHub={() => setHomeHubOpen(true)}
          />
        </main>
      </div>
      <QuickHubModal
        open={homeHubOpen}
        activeTab={activeTab}
        onClose={() => setHomeHubOpen(false)}
        onTabChange={setActiveTab}
      />

      <DockBar activeLabel={activeLabel} />

      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <Navbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
