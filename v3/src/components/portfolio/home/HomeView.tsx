import type React from "react";
import Hero from "@/components/portfolio/hero/hero";
import useWakaTimeStats from "@/hooks/useWakaTimeStats";
import StatsPanel from "@/components/portfolio/home/widgets/StatsPanel";
import type { TabId } from "@/types/navigation";

interface HomeViewProps {
  onQuickNavigate: (tab: TabId) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onQuickNavigate }) => {
  const stats = useWakaTimeStats();

  return (
    <div className="grid min-h-[58vh] gap-3 md:grid-cols-4 md:gap-4">
      <section className="rounded-2xl p-3 md:col-span-1 md:flex md:h-full md:flex-col md:justify-between">
        <Hero onQuickNavigate={onQuickNavigate} />
      </section>

      <StatsPanel stats={stats} />
    </div>
  );
};

export default HomeView;
