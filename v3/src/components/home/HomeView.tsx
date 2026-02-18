import type React from "react";
import Hero from "@/components/hero/hero";
import useWakaTimeStats from "@/hooks/useWakaTimeStats";
import QuickHubButton from "@/components/home/widgets/QuickHubButton";
import StatsPanel from "@/components/home/widgets/StatsPanel";

interface HomeViewProps {
  onOpenQuickHub: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenQuickHub }) => {
  const stats = useWakaTimeStats();

  return (
    <div className="grid min-h-[58vh] gap-3 md:grid-cols-4 md:gap-4">
      <section className="rounded-2xl p-3 md:col-span-1 md:flex md:h-full md:flex-col md:justify-between">
        <Hero />
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground md:mt-0 md:text-xs">
          <p className="text-[10px] uppercase tracking-[0.14em]">Quick Hub</p>
          <QuickHubButton onOpen={onOpenQuickHub} />
        </div>
      </section>

      <StatsPanel stats={stats} />
    </div>
  );
};

export default HomeView;
