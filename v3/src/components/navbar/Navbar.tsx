import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderKanban, Github, Home, User, Wrench } from "lucide-react";
import type { DrawerAction, NavbarProps } from "@/components/navbar/types";
import LauncherDrawer from "@/components/navbar/LauncherDrawer";
import ExpandedDock from "@/components/navbar/ExpandedDock";
import CollapsedDock from "@/components/navbar/CollapsedDock";

const Navbar: React.FC<NavbarProps> = ({ tabs, activeTab, onTabChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState("");

  const closeRef = useRef<number | null>(null);
  const drawerCloseRef = useRef<number | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const openDock = () => {
    if (isMobile) return;
    if (closeRef.current) {
      window.clearTimeout(closeRef.current);
      closeRef.current = null;
    }
    setExpanded(true);
  };

  const closeDockDelayed = () => {
    if (pinned || isMobile) return;
    closeRef.current = window.setTimeout(() => {
      setExpanded(false);
      setDrawerOpen(false);
      setQuery("");
    }, 1800);
  };

  const openDrawer = () => {
    if (drawerCloseRef.current) {
      window.clearTimeout(drawerCloseRef.current);
      drawerCloseRef.current = null;
    }
    setDrawerOpen(true);
  };

  const closeDrawerDelayed = () => {
    if (drawerCloseRef.current) window.clearTimeout(drawerCloseRef.current);
    drawerCloseRef.current = window.setTimeout(() => {
      setDrawerOpen(false);
      setQuery("");
    }, 140);
  };

  useEffect(() => {
    if (drawerOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [drawerOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const applyMobileState = (matches: boolean) => {
      setIsMobile(matches);
      if (matches) setExpanded(true);
    };

    applyMobileState(media.matches);
    const listener = (event: MediaQueryListEvent) => applyMobileState(event.matches);
    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
      if (closeRef.current) window.clearTimeout(closeRef.current);
      if (drawerCloseRef.current) window.clearTimeout(drawerCloseRef.current);
    };
  }, []);

  const actions: DrawerAction[] = useMemo(
    () => [
      {
        id: "home",
        label: "Open Home",
        keywords: "home start workspace",
        icon: Home,
        onSelect: () => {
          onTabChange("home");
          setDrawerOpen(false);
        },
      },
      {
        id: "projects",
        label: "Open Projects",
        keywords: "projects work portfolio",
        icon: FolderKanban,
        onSelect: () => {
          onTabChange("projects");
          setDrawerOpen(false);
        },
      },
      {
        id: "about",
        label: "Open About",
        keywords: "about bio profile",
        icon: User,
        onSelect: () => {
          onTabChange("about");
          setDrawerOpen(false);
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        keywords: "github repo code",
        icon: Github,
        onSelect: () => {
          window.open("https://github.com/infinotiver", "_blank", "noopener,noreferrer");
          setDrawerOpen(false);
        },
      },
      {
        id: "tools",
        label: "Utility Tools",
        keywords: "tools utility",
        icon: Wrench,
        onSelect: () => {
          setDrawerOpen(false);
        },
      },
    ],
    [onTabChange],
  );

  const filteredActions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return actions;
    return actions.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(value));
  }, [actions, query]);

  return (
    <motion.nav
      className="relative"
      onMouseEnter={openDock}
      onMouseLeave={closeDockDelayed}
      onFocus={openDock}
      onBlur={closeDockDelayed}
    >
      <div className="relative">
        <AnimatePresence>
          {expanded && drawerOpen && (
            <LauncherDrawer
              activeTab={activeTab}
              query={query}
              onQueryChange={setQuery}
              actions={filteredActions}
              onMouseEnter={openDrawer}
              onMouseLeave={closeDrawerDelayed}
              searchRef={searchRef}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={{ width: expanded ? "auto" : 110, height: expanded ? 42 : 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {expanded ? (
            <ExpandedDock
              tabs={tabs}
              activeTab={activeTab}
              pinned={pinned}
              drawerOpen={drawerOpen}
              onOpenDrawer={openDrawer}
              onCloseDrawerDelayed={closeDrawerDelayed}
              onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
              onTabChange={(tab) => {
                onTabChange(tab);
                setDrawerOpen(false);
              }}
              onTogglePin={() => setPinned((prev) => !prev)}
            />
          ) : (
            <CollapsedDock onExpand={() => setExpanded(true)} />
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
