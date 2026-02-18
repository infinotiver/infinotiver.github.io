import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import type { NavbarProps } from "@/components/navbar/types";
import ExpandedDock from "@/components/navbar/ExpandedDock";
import { dockStyles } from "@/components/navbar/styles";
import useMediaQuery from "@/hooks/useMediaQuery";

const Navbar: React.FC<NavbarProps> = ({ tabs, activeTab, onTabChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const expanded = isMobile || pinned || isHovered;

  return (
    <motion.nav className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-visible"
          >
            <ExpandedDock
              tabs={tabs}
              activeTab={activeTab}
              isMobile={isMobile}
              pinned={pinned}
              onTabChange={onTabChange}
              onTogglePin={() => setPinned((prev) => !prev)}
            />
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={dockStyles.collapsedPill}
            onMouseEnter={() => setIsHovered(true)}
            onFocus={() => setIsHovered(true)}
            onClick={() => setPinned(true)}
            aria-label="Expand dock"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
