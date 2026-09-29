"use client";

import Link from "next/link";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useWeatherQuery } from "@/hooks/use-weather";
import type { FavoriteCity } from "@/hooks/use-favorite";
import { cityHref } from "@/lib/city-url";
import { capitalize } from "@/lib/weather";

export function FavoriteCityTablet({ city, onRemove }: { city: FavoriteCity; onRemove: () => void }) {
  const { data: weather, isLoading } = useWeatherQuery({ lat: city.lat, lon: city.lon });

  return (
    <div className="relative min-w-[230px]">
      <Link
        href={cityHref(city)}
        className="flex items-center gap-3 rounded-xl border bg-card p-3 pr-9 shadow-sm transition hover:shadow-md"
      >
        {isLoading || !weather ? (
          <div className="flex h-10 w-full items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> {city.name}
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="" className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate font-medium">{city.name}</p>
              <p className="truncate text-xs text-muted-foreground">{capitalize(weather.weather[0].description)}</p>
            </div>
            <p className="ml-auto text-xl font-bold tabular-nums">{Math.round(weather.main.temp)}°</p>
          </>
        )}
      </Link>
      <button
        onClick={() => {
          onRemove();
          toast(`${city.name} saiu dos favoritos`);
        }}
        aria-label={`Remover ${city.name} dos favoritos`}
        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
