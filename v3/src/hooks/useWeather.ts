import { useEffect, useState } from "react";

export interface WeatherData {
  temp: number;
  condition: string;
  emoji: string;
  wind: number;
}

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const CACHE_KEY = "karretOS_weather_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const getCache = (): WeatherData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached) as CacheEntry;
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

const setCache = (data: WeatherData) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

const wmoMeta = (code: number): { condition: string; emoji: string } => {
  if (code === 0) return { condition: "Clear sky", emoji: "☀️" };
  if (code <= 2) return { condition: "Partly cloudy", emoji: "⛅" };
  if (code === 3) return { condition: "Overcast", emoji: "☁️" };
  if (code <= 48) return { condition: "Foggy", emoji: "🌫️" };
  if (code <= 55) return { condition: "Drizzle", emoji: "🌦️" };
  if (code <= 67) return { condition: "Rain", emoji: "🌧️" };
  if (code <= 77) return { condition: "Snow", emoji: "❄️" };
  if (code <= 82) return { condition: "Showers", emoji: "🌦️" };
  if (code <= 99) return { condition: "Thunderstorm", emoji: "⛈️" };
  return { condition: "Unknown", emoji: "🌡️" };
};

export const useWeather = () => {
  const [data, setData] = useState<WeatherData | null>(() => getCache());
  const [loading, setLoading] = useState(() => !getCache());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have cached data, don't fetch
    const cached = getCache();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const url = new URL("https://api.open-meteo.com/v1/forecast");
          url.searchParams.set("latitude", String(latitude));
          url.searchParams.set("longitude", String(longitude));
          url.searchParams.set(
            "current",
            "temperature_2m,weathercode,windspeed_10m",
          );

          const res = await fetch(url.toString());
          if (!res.ok) throw new Error("API error");

          const json = await res.json();
          const { temperature_2m, weathercode, windspeed_10m } = json.current;
          const weatherData = {
            temp: Math.round(temperature_2m),
            wind: Math.round(windspeed_10m),
            ...wmoMeta(weathercode),
          };
          setData(weatherData);
          setCache(weatherData);
        } catch {
          setError("Weather unavailable");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location denied");
        setLoading(false);
      },
      { timeout: 8000 },
    );
  }, []);

  return { data, loading, error };
};
