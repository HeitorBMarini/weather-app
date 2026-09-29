import type { WeatherData } from "@/api/types";
import { Compass, Eye, Gauge, Sunrise, Sunset, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { formatCityTime, kmh, windDirection } from "@/lib/weather";

export function WeatherDetails({ data }: { data: WeatherData }) {
  const { wind, main, sys, timezone, visibility } = data;

  const details = [
    { title: "Nascer do sol", value: formatCityTime(sys.sunrise, timezone, "HH:mm"), icon: Sunrise, color: "text-orange-500" },
    { title: "Pôr do sol", value: formatCityTime(sys.sunset, timezone, "HH:mm"), icon: Sunset, color: "text-rose-500" },
    { title: "Direção do vento", value: `${windDirection(wind.deg)} (${wind.deg}°)`, icon: Compass, color: "text-emerald-500" },
    {
      title: "Rajadas",
      value: wind.gust ? `${kmh(wind.gust)} km/h` : `${kmh(wind.speed)} km/h`,
      icon: Wind,
      color: "text-sky-500",
    },
    { title: "Pressão", value: `${main.pressure} hPa`, icon: Gauge, color: "text-violet-500" },
    {
      title: "Visibilidade",
      value: typeof visibility === "number" ? `${(visibility / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km` : "--",
      icon: Eye,
      color: "text-slate-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3">
          {details.map((d) => (
            <div key={d.title} className="flex items-center gap-3 rounded-xl border p-3.5">
              <d.icon className={`h-5 w-5 shrink-0 ${d.color}`} />
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{d.title}</dt>
                <dd className="font-semibold tabular-nums">{d.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
