import type { WeatherData } from "@/api/types";
import { ArrowDown, ArrowUp, Cloud, Droplets, Wind } from "lucide-react";
import FavoriteButton from "./favorite-button";
import { capitalize, conditionTheme, formatCityTime, formatTemp, kmh } from "@/lib/weather";

interface CurrentWeatherProps {
  data: WeatherData;
  name: string;
  region?: string;
}

export default function CurrentWeather({ data, name, region }: CurrentWeatherProps) {
  const {
    weather: [condition],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind,
    clouds,
  } = data;

  const stats = [
    { icon: Droplets, label: "Umidade", value: `${humidity}%` },
    { icon: Wind, label: "Vento", value: `${kmh(wind.speed)} km/h` },
    { icon: Cloud, label: "Nuvens", value: `${clouds?.all ?? 0}%` },
  ];

  return (
    <section
      aria-label={`Clima agora em ${name}`}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${conditionTheme(condition.id, condition.icon)} p-6 text-white shadow-lg sm:p-8`}
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h2>
          <p className="text-sm text-white/80">
            {[region, data.sys.country].filter(Boolean).join(", ")} · {formatCityTime(data.dt, data.timezone, "EEEE, HH:mm")}
          </p>
        </div>
        <FavoriteButton data={data} name={name} />
      </div>

      <div className="relative mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-end gap-4">
            <p className="text-7xl font-bold leading-none tracking-tighter sm:text-8xl">{formatTemp(temp)}</p>
            <div className="pb-2 text-sm">
              <p className="font-medium">{capitalize(condition.description)}</p>
              <p className="text-white/80">Sensação de {formatTemp(feels_like)}</p>
              <p className="mt-1 flex gap-3 font-medium">
                <span className="flex items-center gap-0.5">
                  <ArrowDown className="h-3.5 w-3.5" /> {formatTemp(temp_min)}
                </span>
                <span className="flex items-center gap-0.5">
                  <ArrowUp className="h-3.5 w-3.5" /> {formatTemp(temp_max)}
                </span>
              </p>
            </div>
          </div>

          <dl className="mt-6 grid max-w-md grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-sm">
                <dt className="flex items-center gap-1.5 text-xs text-white/80">
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </dt>
                <dd className="mt-0.5 font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
          alt=""
          width={180}
          height={180}
          className="mx-auto h-40 w-40 drop-shadow-2xl sm:h-44 sm:w-44"
        />
      </div>
    </section>
  );
}
