import { Briefcase, Clock, TimerIcon } from "lucide-react";
import ClockApp from "@/os/apps/clock/ClockApp";
import PortfolioApp from "@/os/apps/portfolio/PortfolioApp";
import PomodoroApp from "./pomodoro/PomodoroApp";
import type { AppDefinition, AppId } from "@/os/apps/types";

export const apps: AppDefinition[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Your personal site as an app inside the OS shell.",
    icon: Briefcase,
    component: PortfolioApp,
  },
  {
    id: "clock",
    title: "Clock",
    description: "Full-screen clock display.",
    icon: Clock,
    component: ClockApp,
  },
  {
    id: "pomodoro",
    title: "Pomodoro",
    description: "Aesthetic pomodoro [iframe app]",
    component: PomodoroApp,
    icon: TimerIcon,
  },
];

export const getApp = (id: AppId): AppDefinition =>
  apps.find((app) => app.id === id) ?? apps[0];
