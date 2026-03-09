import type React from "react";
import type { HomeStat } from "@/config/home";

interface StatsPanelProps {
  stats: HomeStat[];
}

const findStat = (stats: HomeStat[], label: string, fallback: string) =>
  stats.find((item) => item.label === label)?.value ?? fallback;

interface ActivitySegment {
  name: string;
  percent: number;
}

const shadeClasses = ["bg-black", "bg-zinc-700", "bg-zinc-500", "bg-zinc-400"];

const parseActivityBreakdown = (value: string): ActivitySegment[] =>
  value
    .split("|")
    .map((part) => part.trim())
    .map((part) => {
      const match = part.match(/^(.+?)\s+(\d+(?:\.\d+)?)%$/);
      if (!match) return null;
      return { name: match[1], percent: Number(match[2]) };
    })
    .filter((item): item is ActivitySegment => item !== null)
    .filter((item) => item.percent > 0);

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const totalCoding = findStat(stats, "Total Coding", "--");
  const topLanguage = findStat(stats, "Top Language", "N/A");
  const dailyAverage = findStat(stats, "Daily Average", "--");
  const activityBreakdown = findStat(stats, "Activity Breakdown", "Coding -- | Browsing --");
  const activitySegments = parseActivityBreakdown(activityBreakdown);

  return (
    <aside className="md:col-span-1 md:col-start-4 md:h-full">
      <div className="rounded-2xl p-1 md:h-full">
        <div className="mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Waka Stats</p>
        </div>

        <div className="space-y-1.5">
          <div className="rounded-xl border border-border/60 bg-background/45 px-2.5 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Daily</p>
            <p className="mt-1 text-4xl font-black tracking-tight text-foreground">{dailyAverage}</p>
          </div>

          <div className="rounded-xl border border-border/60 px-2.5 py-2 text-[11px] leading-tight text-muted-foreground">
            <p>
              <span className="font-bold">Total:</span> <span className="font-bold text-foreground">{totalCoding}</span>
            </p>
            <p>
              <span className="font-bold">Lang:</span> <span className="font-bold text-foreground">{topLanguage}</span>
            </p>
          </div>

          <div className="rounded-xl border border-border/60 px-2.5 py-2 text-[11px] leading-tight text-muted-foreground">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em]">Activity</p>
            {activitySegments.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex h-4 w-full gap-px overflow-hidden rounded-full border border-border/60 bg-white/40 p-[2px]">
                  {activitySegments.map((segment, index) => (
                    <span
                      key={segment.name}
                      className={`h-full ${shadeClasses[index % shadeClasses.length]}`}
                      style={{ width: `${segment.percent}%` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="space-y-0.5">
                  {activitySegments.map((segment, index) => (
                    <p key={segment.name} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`h-2 w-2 rounded-sm ${shadeClasses[index % shadeClasses.length]}`}
                          aria-hidden="true"
                        />
                        <span className="font-semibold text-foreground">{segment.name}</span>
                      </span>
                      <span className="font-bold text-foreground">{Math.round(segment.percent)}%</span>
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-semibold text-foreground">{activityBreakdown}</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StatsPanel;
