import type { AppProps } from "@/os/apps/types";
import Hero from "@/components/portfolio/hero/hero";
import StatsPanel from "@/components/portfolio/home/widgets/StatsPanel";
import useWakaTimeStats from "@/hooks/useWakaTimeStats";

const PortfolioApp = (_props: AppProps) => {
  const stats = useWakaTimeStats();

  return (
    <main className="space-y-8 p-4 md:p-6">
      {/* ── hero + stats ── */}
      <div className="grid gap-4 md:grid-cols-4">
        <section className="md:col-span-3">
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

      {/* ── about ── */}
      <section className="max-w-2xl space-y-2">
        <h2 className="text-2xl font-black tracking-tight">About</h2>
        <p className="text-sm text-muted-foreground">
          Student and full-stack developer focused on building things that
          people actually use.
        </p>
      </section>
    </main>
  );
};

export default PortfolioApp;
