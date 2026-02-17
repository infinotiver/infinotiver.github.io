import type React from "react";
import { Folder, Github, Home, User } from "lucide-react";
import Hero from "@/components/hero/hero";
import { homeStats } from "@/config/home";

interface HomeViewProps {
  onOpenQuickHub: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenQuickHub }) => {
  return (
    <div className="grid min-h-[54vh] gap-2 md:grid-cols-[260px_1fr_200px]">
      <section className="space-y-1.5">
        <Hero />
        <div className="space-y-1 text-[11px] text-muted-foreground md:text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenQuickHub}
              className="glass-ui relative h-11 w-11 rounded-full p-1"
              aria-label="Open quick hub"
              title="Open quick hub"
            >
              <span className="absolute left-[5px] top-[5px] rounded-full border border-border/50 bg-background/70 p-[3px]">
                <Folder className="h-2.5 w-2.5" />
              </span>
              <span className="absolute right-[5px] top-[5px] rounded-full border border-border/50 bg-background/70 p-[3px]">
                <User className="h-2.5 w-2.5" />
              </span>
              <span className="absolute bottom-[5px] left-[5px] rounded-full border border-border/50 bg-background/70 p-[3px]">
                <Github className="h-2.5 w-2.5" />
              </span>
              <span className="absolute bottom-[5px] right-[5px] rounded-full border border-border/50 bg-background/70 p-[3px]">
                <Home className="h-2.5 w-2.5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-1.5 md:self-center">
        <div className="text-[11px] text-muted-foreground md:text-xs">
          Open the folder icon for quick links and actions.
        </div>
      </section>

      <aside className="space-y-0 text-xs text-muted-foreground md:self-end md:text-right md:text-sm">
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
