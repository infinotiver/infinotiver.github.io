import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Folder, Github, User, X } from "lucide-react";
import { quickHubActions } from "@/config/home";
import type { TabId } from "@/types/navigation";

interface QuickHubModalProps {
  open: boolean;
  activeTab: TabId;
  onClose: () => void;
  onTabChange: (tab: TabId) => void;
}

const iconMap = {
  projects: Folder,
  about: User,
  github: Github,
} as const;

const QuickHubModal: React.FC<QuickHubModalProps> = ({ open, activeTab, onClose, onTabChange }) => {
  if (activeTab !== "home") return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="glass-ui w-full max-w-sm rounded-2xl p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Quick Hub</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Close quick hub"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid gap-2">
              {quickHubActions.map((action) => {
                const Icon = iconMap[action.id];

                if (action.tab) {
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        onTabChange(action.tab);
                        onClose();
                      }}
                      className="glass-ui flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  );
                }

                return (
                  <a
                    key={action.id}
                    href={action.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-ui flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
                    onClick={onClose}
                  >
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </a>
                );
              })}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickHubModal;
