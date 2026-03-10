import Hero from "@/components/portfolio/hero/hero";
import StatsPanel from "@/components/portfolio/home/widgets/StatsPanel";
import useWakaTimeStats from "@/hooks/useWakaTimeStats";

const PortfolioApp = () => {
  const stats = useWakaTimeStats();

  return (
    <main className="h-full flex flex-col space-y-8 p-6 overflow-y-auto">
      {/* ── hero + about + stats ── */}
      <div className="grid gap-4">
        <section className="space-y-4">
          <Hero />
        </section>
        <StatsPanel stats={stats} />
      </div>

      {/* ── projects ── */}
      <section className="space-y-3">
        <h2 className="text-2xl font-black tracking-tight">Projects</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Infinotiver's Portfolio",
              desc: "webOS Portfolio built with React & Tailwind",
              href: "https://infinotiver.is-a.dev/",
              tags: ["React", "Tailwind"],
            },
            {
              title: "Mind Sink",
              desc: "An ad-free focused image organizer with no infinite scroll.",
              href: "https://mind-sink-6llu.onrender.com/",
              tags: ["React", "MongoDB", "Discord Auth"],
            },
            {
              title: "Emergency Numbers Lookup",
              desc: "A simple utility to get emergency numbers based on your location.",
              href: "https://infinotiver.is-a.dev/emergency-numbers/",
              tags: ["Tailwind", "Node.js"],
            },
            {
              title: "Memento Mori VSC Extension",
              desc: "A VSCode extension that visualizes times and dates in your statusbar",
              href: "https://github.com/infinotiver/memento-mori-status",
              tags: ["VS Code", "Typescript"],
            },
            {
              title: "Aesthetic Pomodoro",
              desc: "A minimalist pomodoro timer with a focus on aesthetics and glassmorphism",
              href: "http://infinotiver.is-a.dev/aesthetic-pomodoro/",
              tags: ["Tailwind", "HTML"],
            },
          ].map(({ title, desc, href, tags }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {title}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3h7m0 0v7m0-7L10 14M5 5H3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
              <div className="mt-auto flex flex-wrap gap-1 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PortfolioApp;
