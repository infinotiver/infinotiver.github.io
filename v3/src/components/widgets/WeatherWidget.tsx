import { Wind } from "lucide-react";
import { Card } from "./Card";
import { useWeather } from "@/hooks/useWeather";

export const WeatherWidget = () => {
  const { data, loading, error } = useWeather();

  if (loading)
    return (
      <Card className="animate-pulse space-y-2">
        <div className="h-10 w-28 rounded-lg bg-muted/40" />
        <div className="h-3 w-20 rounded bg-muted/30" />
      </Card>
    );

  if (error || !data)
    return (
      <Card>
        <p className="text-xs text-muted-foreground">{error ?? "No data"}</p>
      </Card>
    );

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-4xl font-black tracking-tighter text-foreground">
            {data.temp}°
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            {data.condition}
          </p>
        </div>
        <span className="text-4xl leading-none">{data.emoji}</span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Wind className="h-3 w-3 shrink-0" />
        <span>{data.wind} km/h</span>
      </div>
    </Card>
  );
};
