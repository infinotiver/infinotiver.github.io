import type React from "react";

export type AppId = "portfolio" | "clock" | "pomodoro";

export interface AppProps {
  isActive: boolean;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<AppProps>;
}
