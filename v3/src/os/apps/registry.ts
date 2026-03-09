import { FolderKanban, NotepadText } from "lucide-react";
import NotesApp from "@/os/apps/notes/NotesApp";
import PortfolioApp from "@/os/apps/portfolio/PortfolioApp";
import type { AppDefinition, AppId } from "@/os/apps/types";

export const apps: AppDefinition[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Your personal site as an app inside the OS shell.",
    icon: FolderKanban,
    component: PortfolioApp,
  },
  {
    id: "notes",
    title: "Notes",
    description: "Placeholder utility app for desktop expansion.",
    icon: NotepadText,
    component: NotesApp,
  },
];

export const getApp = (id: AppId): AppDefinition =>
  apps.find((app) => app.id === id) ?? apps[0];
