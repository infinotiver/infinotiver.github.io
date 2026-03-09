import { useEffect, useState } from "react";

const ClockApp = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return (
    <main className="flex h-full flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-7xl font-black tracking-tighter text-foreground md:text-8xl">
          {time}
        </h1>
        <p className="mt-4 text-lg font-semibold text-muted-foreground">
          {date}
        </p>
      </div>

      {/* Digital display */}
      <div className="flex gap-4 rounded-2xl border border-border/40 bg-background/40 p-8 font-mono">
        <div className="text-center">
          <div className="text-5xl font-black text-foreground md:text-6xl">
            {hours}
          </div>
          <p className="mt-2 text-xs font-bold uppercase text-muted-foreground">
            Hours
          </p>
        </div>
        <div className="text-3xl font-black text-foreground/40">:</div>
        <div className="text-center">
          <div className="text-5xl font-black text-foreground md:text-6xl">
            {minutes}
          </div>
          <p className="mt-2 text-xs font-bold uppercase text-muted-foreground">
            Minutes
          </p>
        </div>
        <div className="text-3xl font-black text-foreground/40">:</div>
        <div className="text-center">
          <div className="text-5xl font-black text-foreground md:text-6xl">
            {seconds}
          </div>
          <p className="mt-2 text-xs font-bold uppercase text-muted-foreground">
            Seconds
          </p>
        </div>
      </div>
    </main>
  );
};

export default ClockApp;
