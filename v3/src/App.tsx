import React, { useMemo, useState } from "react";
import "./index.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Noise from "@/components/Noise";
import { tabs } from "@/config/navigation";
import type { TabId } from "@/types/navigation";
import WorkspaceContent from "@/components/workspace/WorkspaceContent";
import QuickHubModal from "@/components/home/QuickHubModal";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [homeHubOpen, setHomeHubOpen] = useState(false);

  const activeLabel = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.label ?? "Home",
    [activeTab],
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background px-3 py-4 text-foreground md:px-8 md:py-8">
      <Noise
        patternSize={200}
        patternScaleX={2}
        patternScaleY={2}
        patternRefreshInterval={2}
        patternAlpha={20}
      />
      <div className="relative z-10 mx-auto min-h-[calc(100vh-6rem)] w-full max-w-7xl pb-24 pt-3 md:min-h-[calc(100vh-4.5rem)] md:pb-24 md:pt-8">
        <main>
          <div className="flex items-center mb-3 text-[8px] uppercase tracking-[0.16em] text-muted-foreground md:mb-4 md:tracking-[0.18em]">
            <div className="bg-white rounded-full px-2 py-1 flex items-center">
              <span className="mr-2">Workspace:</span>
              <span className="bg-black text-white rounded-full px-2 py-0.5">
                {activeLabel}
              </span>
            </div>
          </div>
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

      <div className="fixed bottom-4 right-4 z-40 hidden md:block">
        <div className="glass-ui rounded-full px-3 py-1.5 text-xs">
          <a
            className="text-foreground/90 hover:underline"
            href="https://github.com/infinotiver"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="fixed left-1/2 z-50 -translate-x-1/2 bottom-10">
        <Navbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
