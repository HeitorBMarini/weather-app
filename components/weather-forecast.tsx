"use client";

import { useState } from "react";
import type { ForecastData } from "@/lib/api/types";
import { ChevronRight, Droplets, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { DayDetails } from "./day-details";
import { capitalize, formatCityTime, formatTemp, groupForecastByDay, kmh } from "@/lib/weather";

export default function WeatherForecast({ data }: { data: ForecastData }) {
  const tz = data.city.timezone;
  const days = groupForecastByDay(data);
  // O primeiro grupo é hoje (às vezes parcial); os 5 seguintes formam a previsão.
  const next = days.slice(1, 6);
  const [open, setOpen] = useState<number | null>(null);

  const low = Math.min(...next.map((d) => d.min));
  const high = Math.max(...next.map((d) => d.max));
  const span = Math.max(1, high - low);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Próximos 5 dias</CardTitle>
        <CardDescription>Toque em um dia para ver a previsão completa</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="grid h-full auto-rows-fr gap-2">
          {next.map((d, i) => (
            <li key={d.key}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group grid h-full w-full grid-cols-[4.25rem_2.75rem_1fr_1rem] items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition hover:border-sky-400/60 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:grid-cols-[5.5rem_2.75rem_1fr_6.5rem_1rem]"
                aria-label={`Ver detalhes de ${formatCityTime(d.dt, tz, "EEEE, dd/MM")}`}
              >
                <div>
                  <p className="font-medium capitalize">{formatCityTime(d.dt, tz, "EEE")}</p>
                  <p className="text-xs text-muted-foreground">{formatCityTime(d.dt, tz, "dd/MM")}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://openweathermap.org/img/wn/${d.icon.replace("n", "d")}@2x.png`}
                  alt={capitalize(d.description)}
                  title={capitalize(d.description)}
                  className="h-11 w-11"
                />
                <div className="min-w-0">
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
                  <p className="mt-1 truncate text-xs text-muted-foreground">{capitalize(d.description)}</p>
                </div>
                <div className="col-span-2 col-start-2 flex gap-3 text-xs text-muted-foreground sm:col-span-1 sm:col-start-auto sm:flex-col sm:gap-0.5 sm:text-right">
                  <span className="flex items-center gap-1 text-sky-600 sm:justify-end dark:text-sky-400">
                    <Droplets className="h-3.5 w-3.5" /> {Math.round(d.rain * 100)}%
                  </span>
                  <span className="flex items-center gap-1 sm:justify-end">
                    <Wind className="h-3.5 w-3.5" /> {kmh(d.windMax)} km/h
                  </span>
                </div>
                <ChevronRight className="col-start-4 row-span-2 row-start-1 h-4 w-4 self-center text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground sm:col-start-auto sm:row-span-1 sm:row-start-auto" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>

      <DayDetails days={next} index={open} timezone={tz} onIndexChange={setOpen} />
    </Card>
  );
}
