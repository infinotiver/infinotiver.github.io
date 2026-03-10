import { useEffect, useState } from "react";
import { Card } from "./Card";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

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
  // const secs = String(now.getSeconds()).padStart(2, "0");
  const currentDate = new Date().toLocaleDateString();
  return (
    <Card className="self-start">
      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <Clock value={now} size={120} />
        </div>
        <div className="flex flex-col">
          <p className="text-4xl font-black tracking-tighter text-foreground">
            {time}
          </p>
          {/* <span className="text-xl font-bold">{secs}</span> */}
          <span>{currentDate}</span>
        </div>
      </div>
    </Card>
  );
};
