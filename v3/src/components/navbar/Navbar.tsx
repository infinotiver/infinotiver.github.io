import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, FolderKanban, Github, Home, User, Wrench } from "lucide-react";
import type { DrawerAction, NavbarProps } from "@/components/navbar/types";
import LauncherDrawer from "@/components/navbar/LauncherDrawer";
import ExpandedDock from "@/components/navbar/ExpandedDock";
import { dockStyles } from "@/components/navbar/styles";
import useMediaQuery from "@/hooks/useMediaQuery";

const Navbar: React.FC<NavbarProps> = ({ tabs, activeTab, onTabChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const containerRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const expanded = isMobile || pinned || isHovered;

  const closeDrawer = () => {
    setDrawerOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!expanded) closeDrawer();
  }, [expanded]);

  useEffect(() => {
    if (drawerOpen) searchRef.current?.focus();
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        closeDrawer();
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [drawerOpen]);

  const actions: DrawerAction[] = [
    {
      id: "home",
      label: "Open Home",
      keywords: "home start workspace",
      icon: Home,
      onSelect: () => {
        onTabChange("home");
        closeDrawer();
      },
    },
    {
      id: "projects",
      label: "Open Projects",
      keywords: "projects work portfolio",
      icon: FolderKanban,
      onSelect: () => {
        onTabChange("projects");
        closeDrawer();
      },
    },
    {
      id: "about",
      label: "Open About",
      keywords: "about bio profile",
      icon: User,
      onSelect: () => {
        onTabChange("about");
        closeDrawer();
      },
    },
    {
      id: "github",
      label: "Open GitHub",
      keywords: "github repo code",
      icon: Github,
      onSelect: () => {
        window.open("https://github.com/infinotiver", "_blank", "noopener,noreferrer");
        closeDrawer();
      },
    },
    {
      id: "tools",
      label: "Utility Tools",
      keywords: "tools utility",
      icon: Wrench,
      onSelect: closeDrawer,
    },
  ];

  const queryValue = query.trim().toLowerCase();
  const filteredActions = queryValue
    ? actions.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(queryValue))
    : actions;

  return (
    <motion.nav
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {expanded && drawerOpen && (
          <LauncherDrawer
            activeTab={activeTab}
            query={query}
            onQueryChange={setQuery}
            actions={filteredActions}
            searchRef={searchRef}
          />
        )}
      </AnimatePresence>

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
              drawerOpen={drawerOpen}
              onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
              onTabChange={(tab) => {
                onTabChange(tab);
                closeDrawer();
              }}
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
