import Hero from "@/components/portfolio/hero/hero";
import StatsPanel from "@/components/portfolio/home/widgets/StatsPanel";
import useWakaTimeStats from "@/hooks/useWakaTimeStats";

const PortfolioApp = () => {
  const stats = useWakaTimeStats();

  return (
    <main className="h-full flex flex-col space-y-8 p-6 overflow-y-auto">
      {/* ── hero + about + stats (2-col grid) ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-4">
          <Hero />
        </section>
        <StatsPanel stats={stats} />
      </div>

      {/* ── projects ── */}
      <section className="space-y-3">
        <h2 className="text-2xl font-black tracking-tight">Projects</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Infinotiver Site — portfolio and identity.</li>
          <li>Automation Tools — workflow scripts.</li>
          <li>Mini SaaS Lab — MVP experiments.</li>
        </ul>
      </section>
    </main>
  );
};

export default PortfolioApp;
