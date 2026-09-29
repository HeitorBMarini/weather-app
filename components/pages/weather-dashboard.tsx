"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, LocateFixed, MapPin, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import WeatherSkeleton from "../loading-skeleton";
import CurrentWeather from "../currentweather";
import HourlyTemperature from "../hourley-temperature";
import { WeatherDetails } from "../weather-details";
import WeatherForecast from "../weather-forecast";
import FavoriteCities from "../favorite-cities";
import { FALLBACK_LOCATION, useGeolocation } from "@/hooks/use-geolocation";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";

function parseCity(params: URLSearchParams) {
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));
  if (!params.get("lat") || !params.get("lon") || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon, name: params.get("name") ?? undefined, country: params.get("country") ?? undefined };
}

export default function WeatherDashboard() {
  const city = parseCity(useSearchParams());
  const geo = useGeolocation(!city);

  const geoFailed = geo.status === "denied" || geo.status === "unsupported";
  const coordinates = city ?? geo.coordinates ?? (geoFailed ? FALLBACK_LOCATION : null);
  const source = city ? "city" : geo.coordinates ? "gps" : "fallback";

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates, source === "gps");

  if (!coordinates) return <WeatherSkeleton />;

  const refresh = () => {
    weatherQuery.refetch();
    forecastQuery.refetch();
  };

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Não foi possível carregar o clima</AlertTitle>
        <AlertDescription>
          <p>{(weatherQuery.error ?? forecastQuery.error)?.message}</p>
          <Button onClick={refresh} variant="outline" size="sm" className="mt-2">
            <RefreshCcw className="mr-2 h-4 w-4" /> Tentar de novo
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) return <WeatherSkeleton />;

  const place = locationQuery.data?.[0];
  const name =
    source === "city"
      ? city?.name ?? weatherQuery.data.name
      : source === "gps"
        ? place?.name ?? weatherQuery.data.name
        : FALLBACK_LOCATION.name;
  const region = source === "gps" ? place?.state : undefined;

  return (
    <div className="space-y-6">
      {source === "fallback" && (
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            Não conseguimos acessar sua localização, então estamos mostrando {FALLBACK_LOCATION.name}. Busque uma cidade ou
            permita a localização.
          </p>
          <Button variant="outline" size="sm" onClick={geo.getLocation} className="shrink-0">
            <LocateFixed className="mr-2 h-4 w-4" /> Usar minha localização
          </Button>
        </div>
      )}

      <FavoriteCities />

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">
          {source === "city" ? "Cidade pesquisada" : source === "gps" ? "Minha localização" : "Clima agora"}
        </h1>
        <div className="flex items-center gap-2">
          {source === "city" && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <LocateFixed className="mr-2 h-4 w-4" /> Minha localização
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}
            aria-label="Atualizar"
          >
            <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <CurrentWeather data={weatherQuery.data} name={name} region={region} />
      <HourlyTemperature data={forecastQuery.data} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <WeatherForecast data={forecastQuery.data} />
        <WeatherDetails data={weatherQuery.data} />
      </div>
    </div>
  );
}
