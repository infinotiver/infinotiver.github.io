import { useEffect, useState } from "react";
import { Card } from "./Card";

export const ClockWidget = () => {
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
  const secs = String(now.getSeconds()).padStart(2, "0");

  return (
    <Card>
      <p className="font-mono text-5xl font-black tracking-tighter text-foreground">
        {time}
      </p>
      <p className="mt-1 font-mono text-sm font-bold text-muted-foreground">
        :{secs}s
      </p>
    </Card>
  );
};
