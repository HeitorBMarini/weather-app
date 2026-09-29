import type { ForecastData } from "@/api/types";
import { Droplets } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { capitalize, formatCityTime, formatTemp } from "@/lib/weather";

type Day = {
  key: string;
  dt: number;
  min: number;
  max: number;
  rain: number;
  icon: string;
  description: string;
};

export default function WeatherForecast({ data }: { data: ForecastData }) {
  const tz = data.city.timezone;
  const days = new Map<string, Day>();

  for (const item of data.list) {
    const key = formatCityTime(item.dt, tz, "yyyy-MM-dd");
    const hour = Number(formatCityTime(item.dt, tz, "H"));
    const day = days.get(key);
    if (!day) {
      days.set(key, {
        key,
        dt: item.dt,
        min: item.main.temp_min,
        max: item.main.temp_max,
        rain: item.pop ?? 0,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      });
    } else {
      day.min = Math.min(day.min, item.main.temp_min);
      day.max = Math.max(day.max, item.main.temp_max);
      day.rain = Math.max(day.rain, item.pop ?? 0);
      // Usa a condição do meio do dia como resumo.
      if (hour >= 11 && hour <= 14) {
        day.icon = item.weather[0].icon;
        day.description = item.weather[0].description;
      }
    }
  }

  const next = [...days.values()].slice(1, 6);
  const low = Math.min(...next.map((d) => d.min));
  const high = Math.max(...next.map((d) => d.max));
  const span = Math.max(1, high - low);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos 5 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {next.map((d) => (
            <li key={d.key} className="grid grid-cols-[4.5rem_2.5rem_1fr] items-center gap-3 py-3 sm:grid-cols-[6rem_2.5rem_1fr_3.5rem]">
              <div>
                <p className="font-medium capitalize">{formatCityTime(d.dt, tz, "EEE")}</p>
                <p className="text-xs text-muted-foreground">{formatCityTime(d.dt, tz, "dd/MM")}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://openweathermap.org/img/wn/${d.icon.replace("n", "d")}@2x.png`} alt={capitalize(d.description)} title={capitalize(d.description)} className="h-10 w-10" />
              <div className="flex items-center gap-2 text-sm tabular-nums">
                <span className="w-8 text-right text-muted-foreground">{formatTemp(d.min)}</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-muted" aria-hidden>
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{ left: `${((d.min - low) / span) * 100}%`, right: `${100 - ((d.max - low) / span) * 100}%` }}
                  />
                </div>
                <span className="w-8 font-medium">{formatTemp(d.max)}</span>
              </div>
              <span className="col-span-3 flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 sm:col-span-1 sm:justify-end">
                {d.rain >= 0.1 && (
                  <>
                    <Droplets className="h-3.5 w-3.5" /> {Math.round(d.rain * 100)}%
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
