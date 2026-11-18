import type { WeatherData } from "@/lib/api/types";
import { Cloud, Compass, Droplets, Eye, Gauge, Hourglass, Sunrise, Sunset, Thermometer, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { StatTile } from "./stat-tile";
import {
  cloudLabel,
  dewPoint,
  dewPointLabel,
  formatCityTime,
  formatDuration,
  formatKm,
  formatTemp,
  humidityLabel,
  kmh,
  pressureLabel,
  visibilityLabel,
  windDirection,
  windLabel,
} from "@/lib/weather";

export function WeatherDetails({ data }: { data: WeatherData }) {
  const { wind, main, sys, timezone, visibility, clouds } = data;
  const dp = dewPoint(main.temp, main.humidity);
  const daylight = sys.sunset - sys.sunrise;
  const sunProgress = Math.round(((data.dt - sys.sunrise) / daylight) * 100);

  const details = [
    {
      title: "Nascer do sol",
      value: formatCityTime(sys.sunrise, timezone, "HH:mm"),
      hint: `Dia com ${formatDuration(daylight)}`,
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Pôr do sol",
      value: formatCityTime(sys.sunset, timezone, "HH:mm"),
      hint: sunProgress < 0 ? "Antes do amanhecer" : sunProgress > 100 ? "Já anoiteceu" : `${sunProgress}% do dia já passou`,
      icon: Sunset,
      color: "text-rose-500",
    },
    {
      title: "Vento",
      value: `${kmh(wind.speed)} km/h`,
      hint: windLabel(wind.speed),
      icon: Wind,
      color: "text-sky-500",
    },
    {
      title: "Direção e rajadas",
      value: `${windDirection(wind.deg)} · ${wind.deg}°`,
      hint: wind.gust ? `Rajadas de até ${kmh(wind.gust)} km/h` : "Sem rajadas registradas",
      icon: Compass,
      color: "text-emerald-500",
    },
    {
      title: "Umidade",
      value: `${main.humidity}%`,
      hint: humidityLabel(main.humidity),
      icon: Droplets,
      color: "text-blue-500",
      meter: main.humidity,
    },
    {
      title: "Ponto de orvalho",
      value: formatTemp(dp),
      hint: dewPointLabel(dp),
      icon: Thermometer,
      color: "text-teal-500",
    },
    {
      title: "Pressão",
      value: `${main.pressure} hPa`,
      hint: pressureLabel(main.pressure),
      icon: Gauge,
      color: "text-violet-500",
    },
    {
      title: "Visibilidade",
      value: formatKm(visibility),
      hint: visibilityLabel(visibility),
      icon: Eye,
      color: "text-slate-500",
    },
    {
      title: "Nuvens",
      value: `${clouds?.all ?? 0}%`,
      hint: cloudLabel(clouds?.all ?? 0),
      icon: Cloud,
      color: "text-zinc-400",
      meter: clouds?.all ?? 0,
    },
    {
      title: "Duração do dia",
      value: formatDuration(daylight),
      hint: `${formatCityTime(sys.sunrise, timezone, "HH:mm")} às ${formatCityTime(sys.sunset, timezone, "HH:mm")}`,
      icon: Hourglass,
      color: "text-amber-500",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Detalhes de agora</CardTitle>
        <CardDescription>Atualizado às {formatCityTime(data.dt, timezone, "HH:mm")} (horário local)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <dl className="grid h-full auto-rows-fr grid-cols-2 gap-3">
          {details.map((d) => (
            <StatTile key={d.title} {...d} />
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
