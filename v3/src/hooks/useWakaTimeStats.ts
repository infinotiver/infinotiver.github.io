import { useEffect, useState } from "react";
import { homeStats, type HomeStat } from "@/config/home";

type AnyRecord = Record<string, unknown>;

const WAKATIME_API_URL = (import.meta.env.VITE_WAKATIME_API_URL as string | undefined) ?? "/api/wakatime";

const asRecord = (value: unknown): AnyRecord | null =>
  typeof value === "object" && value !== null ? (value as AnyRecord) : null;

const fromPath = (root: AnyRecord, path: string): unknown =>
  path.split(".").reduce<unknown>((acc, part) => {
    const rec = asRecord(acc);
    return rec ? rec[part] : undefined;
  }, root);

const pickString = (root: AnyRecord, paths: string[]): string | null => {
  for (const path of paths) {
    const value = fromPath(root, path);
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return null;
};

const pickNumber = (root: AnyRecord, paths: string[]): number | null => {
  for (const path of paths) {
    const value = fromPath(root, path);
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
};

const formatInteger = (value: number | null, fallback: string): string =>
  value === null ? fallback : Intl.NumberFormat("en-US").format(Math.round(value));

const isOtherLanguage = (name: string): boolean => name.trim().toLowerCase() === "other";

const deriveStats = (payload: unknown): HomeStat[] => {
  const body = asRecord(payload);
  const root = asRecord(body?.data) ?? body;
  if (!root) return homeStats;

  const totalCoding =
    pickString(root, [
      "human_readable_total_including_other_language",
      "human_readable_total",
      "human_readable_total_with_other_language",
      "grand_total.text",
      "cumulative_total.text",
      "text",
    ]) ?? homeStats[0].value;

  const dailyAverage =
    pickString(root, [
      "daily_average_including_other_language",
      "human_readable_daily_average_including_other_language",
      "human_readable_daily_average",
      "daily_average.text_including_other_language",
      "daily_average.text",
    ]) ?? homeStats[1].value;

  const languages = fromPath(root, "languages");
  const filteredLanguages = Array.isArray(languages)
    ? languages
        .map((lang) => asRecord(lang))
        .filter((lang): lang is AnyRecord => Boolean(lang))
        .filter((lang) => {
          const name = typeof lang.name === "string" ? lang.name : "";
          return !isOtherLanguage(name);
        })
    : [];

  const topLanguage = filteredLanguages.length > 0 ? filteredLanguages[0] : null;
  const topLanguageName = typeof topLanguage?.name === "string" ? topLanguage.name : "N/A";
  const topLanguagePercent =
    (typeof topLanguage?.percent === "number" && Math.round(topLanguage.percent)) ||
    pickNumber(topLanguage ?? {}, ["percent"]);
  const topLanguageValue =
    topLanguageName === "N/A"
      ? homeStats[2].value
      : `${topLanguageName}${topLanguagePercent ? ` ${topLanguagePercent}%` : ""}`;

  const categories = fromPath(root, "categories");
  const activityBreakdown =
    Array.isArray(categories) && categories.length > 0
      ? categories
          .map((item) => asRecord(item))
          .filter((item): item is AnyRecord => Boolean(item))
          .slice(0, 3)
          .map((item) => {
            const name = typeof item.name === "string" ? item.name : "Unknown";
            const percent = formatInteger(
              typeof item.percent === "number" ? item.percent : null,
              typeof item.text === "string" ? item.text : "--",
            );
            return `${name} ${percent}${typeof item.percent === "number" ? "%" : ""}`;
          })
          .join(" | ")
      : homeStats[3].value;

  return [
    { label: "Total Coding", value: totalCoding },
    { label: "Daily Average", value: dailyAverage },
    { label: "Top Language", value: topLanguageValue },
    { label: "Activity Breakdown", value: activityBreakdown },
  ];
};

const useWakaTimeStats = (): HomeStat[] => {
  const [stats, setStats] = useState<HomeStat[]>(homeStats);

  useEffect(() => {
    if (!WAKATIME_API_URL) return;
    let isActive = true;

    const load = async () => {
      try {
        const response = await fetch(WAKATIME_API_URL, { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as unknown;
        if (isActive) setStats(deriveStats(payload));
      } catch {
        // Keep fallback stats when WakaTime is not reachable.
      }
    };

    void load();
    return () => {
      isActive = false;
    };
  }, []);

  return stats;
};

export default useWakaTimeStats;
