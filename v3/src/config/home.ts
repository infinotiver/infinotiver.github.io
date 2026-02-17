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
  { label: "Shipped This Year", value: "06" },
  { label: "Client Builds", value: "15" },
  { label: "Avg Delivery", value: "9d" },
];

export const quickHubActions: QuickHubAction[] = [
  { id: "projects", label: "Open Projects", tab: "projects" },
  { id: "about", label: "Open About", tab: "about" },
  { id: "github", label: "Open GitHub", href: "https://github.com/infinotiver" },
];
