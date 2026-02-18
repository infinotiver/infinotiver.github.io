import type { TabId } from "@/types/navigation";

export interface HomeStat {
  label: string;
  value: string;
}

export interface QuickHubAction {
  id: "projects" | "about" | "github";
  label: string;
  tab?: TabId;
  href?: string;
}

export const homeStats: HomeStat[] = [
  { label: "Total Coding", value: "--" },
  { label: "Daily Average", value: "--" },
  { label: "Top Language", value: "N/A" },
  { label: "Activity Breakdown", value: "Coding -- | Browsing --" },
];

export const quickHubActions: QuickHubAction[] = [
  { id: "projects", label: "Open Projects", tab: "projects" },
  { id: "about", label: "Open About", tab: "about" },
  { id: "github", label: "Open GitHub", href: "https://github.com/infinotiver" },
];
