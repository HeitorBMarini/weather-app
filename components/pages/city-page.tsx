import { WeatherData, ForecastData } from "@/api/types";
import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import CurrentWeather from "../currentweather";
import HourlyTemperature from "../hourley-temperature";
import WeatherSkeleton from "../loading-skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { WeatherDetails } from "../weather-details";
import WeatherForecast from "../weather-forecast";
import FavoriteButton from "../favorite-button";


interface CityPageProps {
  params: { name: string };
  searchParams: { lat?: string; lon?: string };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const lat = parseFloat(searchParams.lat || "0");
  const lon = parseFloat(searchParams.lon || "0");

  if (!lat || !lon) return notFound();

  let weatherData: WeatherData | null = null;
  let forecastData: ForecastData | null = null;

  try {
    weatherData = await getWeather({ lat, lon });
    forecastData = await getForecast({ lat, lon });
  } catch (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Falha ao carregar os dados do tempo. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherData || !forecastData) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.name}, {weatherData.sys.country}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton data={{ ...weatherData, name: params.name }} />
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherData} />
        <HourlyTemperature data={forecastData} />
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherData} />
          <WeatherForecast data={forecastData} />
        </div>
      </div>
    </div>
  );
}
function getWeather(arg0: { lat: number; lon: number; }): WeatherData | PromiseLike<WeatherData | null> | null {
    throw new Error("Function not implemented.");
}

function getForecast(arg0: { lat: number; lon: number; }): ForecastData | PromiseLike<ForecastData | null> | null {
    throw new Error("Function not implemented.");
}

