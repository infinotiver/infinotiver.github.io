import React, { useState } from "react";
import { Folder } from "lucide-react";
import { siGithub } from "simple-icons";

interface QuickHubActionsProps {
  accent: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  brandPath?: string;
  onClick: () => void;
}

const QuickHubActions: React.FC<QuickHubActionsProps> = ({ accent }) => {
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const actions: QuickAction[] = [
    {
      id: "github",
      label: "GitHub",
      icon: Folder,
      brandPath: siGithub.path,
      onClick: () =>
        window.open(
          "https://github.com/infinotiver",
          "_blank",
          "noopener,noreferrer",
        ),
    },
  ];

  return (
    <div
      className="relative flex w-max items-center gap-2 rounded-full px-2 py-2"
      style={{ backgroundColor: `${accent}88` }}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            onMouseEnter={() => setTooltipId(action.id)}
            onMouseLeave={() => setTooltipId(null)}
            onFocus={() => setTooltipId(action.id)}
            onBlur={() => setTooltipId(null)}
            aria-label={action.label}
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border glass-ui bg-white!  transition-all hover:scale-105 duration-150"
          >
            {tooltipId === action.id && (
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
                {action.label}
              </span>
            )}
            {action.brandPath ? (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 text-black"
              >
                <path d={action.brandPath} fill="currentColor" />
              </svg>
            ) : (
              <Icon className="h-4 w-4 text-black" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default QuickHubActions;
