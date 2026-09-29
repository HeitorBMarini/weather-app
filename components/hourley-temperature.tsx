"use client";

import type { ForecastData } from "@/api/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Area, Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCityTime } from "@/lib/weather";

type Point = { time: string; temp: number; feels: number; rain: number };

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold">{p.time}</p>
      <p className="text-sky-500">Temperatura: {Math.round(p.temp)}°C</p>
      <p className="text-amber-500">Sensação: {Math.round(p.feels)}°C</p>
      <p className="text-muted-foreground">Chance de chuva: {p.rain}%</p>
    </div>
  );
}

export default function HourlyTemperature({ data }: { data: ForecastData }) {
  const tz = data.city.timezone;
  const points: Point[] = data.list.slice(0, 9).map((item) => ({
    time: formatCityTime(item.dt, tz, "HH:mm"),
    temp: item.main.temp,
    feels: item.main.feels_like,
    rain: Math.round((item.pop ?? 0) * 100),
  }));

  const maxRain = Math.max(...points.map((p) => p.rain));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas 24 horas</CardTitle>
        <CardDescription>
          Temperatura, sensação térmica e chance de chuva a cada 3 horas
          {maxRain >= 40 ? ` · até ${maxRain}% de chance de chuva` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={points} margin={{ left: -12, right: 4, top: 8 }}>
              <defs>
                <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.25} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis yAxisId="t" domain={["dataMin - 2", "dataMax + 2"]} tickFormatter={(v) => `${Math.round(v)}°`} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis yAxisId="r" orientation="right" domain={[0, 100]} hide />
              <Tooltip content={<ChartTooltip />} />
              <Bar yAxisId="r" dataKey="rain" fill="#60a5fa" fillOpacity={0.25} radius={[4, 4, 0, 0]} barSize={18} name="Chuva" />
              <Area yAxisId="t" type="monotone" dataKey="temp" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#tempFill)" name="Temperatura" />
              <Line yAxisId="t" type="monotone" dataKey="feels" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" dot={false} name="Sensação" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-sky-500" /> Temperatura</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded border-t-2 border-dashed border-amber-500" /> Sensação</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-blue-400/30" /> Chance de chuva</span>
        </div>
      </CardContent>
    </Card>
  );
}
