"use client";

import { useEffect } from "react";
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronLeft, ChevronRight, Cloud, Compass, Droplets, Gauge, Thermometer, Umbrella, Wind } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { StatTile } from "./stat-tile";
import {
  capitalize,
  cloudLabel,
  conditionTheme,
  formatCityTime,
  formatMm,
  formatTemp,
  humidityLabel,
  kmh,
  pressureLabel,
  rainLabel,
  windDirection,
  windLabel,
  type ForecastDay,
} from "@/lib/weather";

interface DayDetailsProps {
  days: ForecastDay[];
  index: number | null;
  timezone: number;
  onIndexChange: (index: number | null) => void;
}

type Point = { time: string; temp: number; rain: number };

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold">{p.time}</p>
      <p className="text-sky-500">Temperatura: {Math.round(p.temp)}°C</p>
      <p className="text-muted-foreground">Chance de chuva: {p.rain}%</p>
    </div>
  );
}

export function DayDetails({ days, index, timezone, onIndexChange }: DayDetailsProps) {
  const day = index === null ? null : days[index];

  // Setas do teclado trocam de dia com a janela aberta.
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && index < days.length - 1) onIndexChange(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, days.length, onIndexChange]);

  return (
    <Dialog open={day !== null} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent className="flex max-h-[92svh] flex-col gap-0 overflow-y-auto overflow-x-hidden p-0 sm:max-w-2xl [&>*]:min-w-0 [&>*]:shrink-0 [&>button:last-child]:z-10 [&>button:last-child]:text-white [&>button:last-child]:opacity-90">
        {day && index !== null && (
          <>
            <div className={`relative overflow-hidden bg-gradient-to-br ${conditionTheme(day.conditionId, day.icon.replace("n", "d"))} p-6 pr-12 text-white`}>
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <DialogHeader className="relative text-left">
                <DialogTitle className="text-2xl">{capitalize(formatCityTime(day.dt, timezone, "EEEE"))}</DialogTitle>
                <DialogDescription className="text-white/80">
                  {formatCityTime(day.dt, timezone, "dd 'de' MMMM")} · {capitalize(day.description)}
                </DialogDescription>
              </DialogHeader>
              <div className="relative mt-4 flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon.replace("n", "d")}@4x.png`}
                  alt=""
                  className="-my-4 h-28 w-28 drop-shadow-xl"
                />
                <div>
                  <p className="text-5xl font-bold tracking-tighter tabular-nums">
                    {formatTemp(day.max)}
                    <span className="ml-2 text-2xl font-medium text-white/70">{formatTemp(day.min)}</span>
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Sensação entre {formatTemp(day.feelsMin)} e {formatTemp(day.feelsMax)}
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-6 p-5 sm:p-6">
              <dl className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile
                  icon={Umbrella}
                  title="Chuva"
                  value={`${Math.round(day.rain * 100)}%`}
                  hint={rainLabel(day.rain)}
                  color="text-sky-500"
                  meter={day.rain * 100}
                />
                <StatTile
                  icon={Droplets}
                  title="Volume"
                  value={formatMm(day.rainMm)}
                  hint={day.rainMm > 0 ? "Previsto no dia" : "Sem chuva prevista"}
                  color="text-blue-500"
                />
                <StatTile
                  icon={Wind}
                  title="Vento máx."
                  value={`${kmh(day.windMax)} km/h`}
                  hint={windLabel(day.windMax)}
                  color="text-emerald-500"
                />
                <StatTile
                  icon={Compass}
                  title="Direção"
                  value={`${windDirection(day.windDeg)} · ${day.windDeg}°`}
                  hint={`Rajadas até ${kmh(day.gustMax)} km/h`}
                  color="text-teal-500"
                />
                <StatTile
                  icon={Droplets}
                  title="Umidade"
                  value={`${day.humidity}%`}
                  hint={`Média · ${humidityLabel(day.humidity)}`}
                  color="text-indigo-500"
                  meter={day.humidity}
                />
                <StatTile
                  icon={Gauge}
                  title="Pressão"
                  value={`${day.pressure} hPa`}
                  hint={`Média · ${pressureLabel(day.pressure)}`}
                  color="text-violet-500"
                />
                <StatTile
                  icon={Cloud}
                  title="Nuvens"
                  value={`${day.clouds}%`}
                  hint={cloudLabel(day.clouds)}
                  color="text-zinc-400"
                  meter={day.clouds}
                />
                <StatTile
                  icon={Thermometer}
                  title="Amplitude"
                  value={`${Math.round(day.max - day.min)}°`}
                  hint={`De ${formatTemp(day.min)} a ${formatTemp(day.max)}`}
                  color="text-amber-500"
                />
              </dl>

              <section>
                <h3 className="mb-2 text-sm font-semibold">Ao longo do dia</h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={day.items.map<Point>((i) => ({
                        time: formatCityTime(i.dt, timezone, "HH:mm"),
                        temp: i.main.temp,
                        rain: Math.round((i.pop ?? 0) * 100),
                      }))}
                      margin={{ left: -16, right: 4, top: 8 }}
                    >
                      <defs>
                        <linearGradient id="dayTempFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.25} />
                      <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={11} />
                      <YAxis yAxisId="t" domain={["dataMin - 2", "dataMax + 2"]} tickFormatter={(v) => `${Math.round(v)}°`} tickLine={false} axisLine={false} fontSize={11} />
                      <YAxis yAxisId="r" orientation="right" domain={[0, 100]} hide />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar yAxisId="r" dataKey="rain" fill="#60a5fa" fillOpacity={0.3} radius={[4, 4, 0, 0]} barSize={16} />
                      <Area yAxisId="t" type="monotone" dataKey="temp" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#dayTempFill)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="min-w-0">
                <h3 className="mb-2 text-sm font-semibold">Hora a hora (a cada 3 horas)</h3>
                <ul className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
                  {day.items.map((i) => (
                    <li
                      key={i.dt}
                      className="flex w-[5.5rem] shrink-0 snap-start flex-col items-center rounded-xl border bg-card px-2 py-3 text-center"
                    >
                      <span className="text-xs font-medium text-muted-foreground">{formatCityTime(i.dt, timezone, "HH:mm")}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png`}
                        alt={capitalize(i.weather[0].description)}
                        title={capitalize(i.weather[0].description)}
                        className="h-10 w-10"
                      />
                      <span className="font-semibold tabular-nums">{formatTemp(i.main.temp)}</span>
                      <span className="mt-1 flex items-center gap-0.5 text-[11px] text-sky-600 dark:text-sky-400">
                        <Droplets className="h-3 w-3" /> {Math.round((i.pop ?? 0) * 100)}%
                      </span>
                      <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                        <Wind className="h-3 w-3" /> {kmh(i.wind.speed)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{i.main.humidity}% UR</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="flex items-center justify-between gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => onIndexChange(index - 1)}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  <span className="capitalize">{index > 0 ? formatCityTime(days[index - 1].dt, timezone, "EEE") : "Anterior"}</span>
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {index + 1} de {days.length}
                </span>
                <Button variant="ghost" size="sm" disabled={index === days.length - 1} onClick={() => onIndexChange(index + 1)}>
                  <span className="capitalize">
                    {index < days.length - 1 ? formatCityTime(days[index + 1].dt, timezone, "EEE") : "Próximo"}
                  </span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
