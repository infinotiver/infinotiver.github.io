import { Folder, Home, User } from "lucide-react";
import type { TabItem } from "@/types/navigation";

export const tabs: TabItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "about", label: "About", icon: User },
];
