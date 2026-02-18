import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderKanban, Github, Home, User, Wrench } from "lucide-react";
import type { DrawerAction, NavbarProps } from "@/components/navbar/types";
import LauncherDrawer from "@/components/navbar/LauncherDrawer";
import ExpandedDock from "@/components/navbar/ExpandedDock";
import CollapsedDock from "@/components/navbar/CollapsedDock";
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

      <motion.div
        initial={false}
        animate={{ width: expanded ? "auto" : 186, height: 42 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="overflow-visible"
      >
        {expanded ? (
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
        ) : (
          <CollapsedDock
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => {
              onTabChange(tab);
              closeDrawer();
            }}
            onToggleDrawer={() => {
              setPinned(true);
              setDrawerOpen(true);
            }}
          />
        )}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
