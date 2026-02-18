import type React from "react";
import { Folder, Github, Home, User } from "lucide-react";
import Hero from "@/components/hero/hero";
import { homeStats } from "@/config/home";

interface HomeViewProps {
  onOpenQuickHub: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenQuickHub }) => {
  const quickHubIcons = [
    { Icon: Folder, className: "left-[5px] top-[5px]" },
    { Icon: User, className: "right-[5px] top-[5px]" },
    { Icon: Github, className: "bottom-[5px] left-[5px]" },
    { Icon: Home, className: "bottom-[5px] right-[5px]" },
  ];

  return (
    <div className="grid min-h-[54vh] gap-3 md:grid-cols-4 md:items-start">
      <section className="space-y-2 md:col-span-1">
        <Hero />
        <div className="text-[11px] text-muted-foreground md:text-xs">
          <button
            type="button"
            onClick={onOpenQuickHub}
            className="glass-ui relative h-11 w-11 rounded-full p-1"
            aria-label="Open quick hub"
            title="Open quick hub"
          >
            {quickHubIcons.map(({ Icon, className }) => (
              <span
                key={className}
                className={`absolute ${className} rounded-full border border-border/50 bg-background/70 p-[3px]`}
              >
                <Icon className="h-2.5 w-2.5" />
              </span>
            ))}
          </button>
        </div>
      </section>

      <section className="space-y-1.5 md:col-span-2 md:self-center">
        <div className="text-[11px] text-muted-foreground md:text-xs">
          Open the folder icon for quick links and actions.
        </div>
      </section>

      <aside className="space-y-0 text-xs text-muted-foreground md:col-span-1 md:self-end md:text-right md:text-sm">
        {homeStats.map((item) => (
          <p key={item.label}>
            {item.label}: <span className="font-semibold text-foreground">{item.value}</span>
          </p>
        ))}
      </aside>
    </div>
  );
};

export default HomeView;
