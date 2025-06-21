"use client";

import { AlertCircleIcon, MapPin, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import WeatherSkeleton from "../loading-skeleton";
import AlertLocation from "../alert-location";
import AlertCoordinate from "../alert-coordinate";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import CurrentWeather from "../currentweather";
import HourlyTemperature from "../hourley-temperature";
import { WeatherDetails } from "../weather-details";
import WeatherForecast from "../weather-forecast";

import FavoriteCities from "../favorite-cities";

export default function WeatherDashboard() {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    <WeatherSkeleton />;
  }

  if (locationError) {
    return <AlertLocation />;
  }

  if (!coordinates) {
    return <AlertCoordinate />;
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return(
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Erro </AlertTitle>
        <AlertDescription>
          <p>Falha na leitura, tente novamente</p>
          <Button onClick={handleRefresh} variant={"outline"} size="sm" className="mt-2">
            <MapPin className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if(!weatherQuery.data || !forecastQuery.data || !locationQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="container items-center mx-auto p-4">
      <FavoriteCities />

      <div className="flex justify-between">
        <h2 className="mb-2 font-bold text-xl tracking-tight">Minha Localização</h2>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          className="mb-4"
        >
          <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""} `} />
        </Button>
      </div>

      <div className="lg:grid-cols-2 sm:grid-cols-1 grid gap-4">
        <div>
          <CurrentWeather
            data={weatherQuery.data} locationName={locationName}
            />
        </div>
        <div>
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div>
          <WeatherDetails data={weatherQuery.data} />
        </div>
        <div>
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
}
