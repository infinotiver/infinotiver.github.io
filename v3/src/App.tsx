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
    <div className="relative min-h-screen w-full bg-background text-foreground px-3 py-4 md:px-8 md:py-8">
      <Noise
        patternSize={220}
        patternScaleX={2}
        patternScaleY={2}
        patternRefreshInterval={1}
        patternAlpha={28}
      />
      <div className="relative z-10 mx-auto min-h-[calc(100vh-6rem)] w-full max-w-7xl pb-24 pt-3 md:min-h-[calc(100vh-4.5rem)] md:pb-24 md:pt-8">
        <main>
          <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:mb-4 md:tracking-[0.18em]">
            Workspace: {activeLabel}
          </p>
          <WorkspaceContent activeTab={activeTab} onOpenQuickHub={() => setHomeHubOpen(true)} />
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

      <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 md:bottom-4">
        <Navbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
