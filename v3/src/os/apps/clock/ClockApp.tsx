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
    </main>
  );
};

export default ClockApp;
