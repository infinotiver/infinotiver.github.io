import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TabId } from "@/types/navigation";
import HomeView from "@/components/home/HomeView";

interface WorkspaceContentProps {
  activeTab: TabId;
  onOpenQuickHub: () => void;
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({ activeTab, onOpenQuickHub }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -14 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {activeTab === "home" && <HomeView onOpenQuickHub={onOpenQuickHub} />}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold md:text-5xl">Projects</h2>
            <ul className="space-y-2 text-sm text-muted-foreground md:text-base">
              <li>Infinotiver Site - portfolio and identity.</li>
              <li>Automation Tools - workflow scripts.</li>
              <li>Mini SaaS Lab - MVP experiments.</li>
            </ul>
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold md:text-5xl">About</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Student and full-stack developer focused on building things that people actually use.
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkspaceContent;
