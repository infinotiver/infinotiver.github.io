import { useState } from "react";
import type { TabId } from "@/types/navigation";
import type { AppProps } from "@/os/apps/types";
import PortfolioWorkspace from "@/os/apps/portfolio/PortfolioWorkspace";

const PortfolioApp = (_props: AppProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <main>
      <PortfolioWorkspace
        activeTab={activeTab}
        onQuickNavigate={setActiveTab}
      />
    </main>
  );
};

export default PortfolioApp;
