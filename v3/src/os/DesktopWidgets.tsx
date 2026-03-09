import { useEffect, useState } from "react";

/* ── shared card shell ── */
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

/* ── Clock widget ── */
const ClockWidget = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const seconds = now.toLocaleTimeString("en-US", {
    second: "2-digit",
  });

  return (
    <Card>
      <p className="font-mono text-5xl font-black tracking-tighter text-foreground">
        {time}
      </p>
      <p className="mt-1 font-mono text-sm font-bold text-muted-foreground">
        :{seconds.padStart(2, "0")}s
      </p>
    </Card>
  );
};

/* ── Composed widget stack (sidebar) ── */
const DesktopWidgets = () => (
  <div className="flex h-full flex-col">
    <div className="flex flex-col gap-3">
      <ClockWidget />
    </div>
    <div className="mt-auto pt-6">
      <p className="text-right text-4xl font-black tracking-tighter text-muted-foreground/20 lg:text-5xl">
        karretOS
      </p>
    </div>
  </div>
);

export default DesktopWidgets;
