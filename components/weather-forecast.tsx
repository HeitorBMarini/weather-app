import { ForecastData } from "@/api/types";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const weatherDescriptions: Record<string, string> = {
  "clear sky": "Céu limpo",
  "few clouds": "Poucas nuvens",
  "scattered clouds": "Nuvens dispersas",
  "broken clouds": "Nuvens quebradas",
  "overcast clouds": "Nublado",
  "light rain": "Chuva leve",
  "moderate rain": "Chuva moderada",
  "heavy intensity rain": "Chuva intensa",
  "thunderstorm": "Trovoadas",
};

export default function WeatherForecast({ data }: WeatherForecastProps) {
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const dateKey = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: forecast.dt,
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
      };
    } else {
      acc[dateKey].temp_min = Math.min(acc[dateKey].temp_min, forecast.main.temp_min);
      acc[dateKey].temp_max = Math.max(acc[dateKey].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecasts).slice(1, 6);
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão para os próximos 5 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid md:grid-cols-3 sm:grid-cols-1  sm:justify-center items-center gap-4 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, dd/MM", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {weatherDescriptions[day.weather.description.toLowerCase()] ||
                    day.weather.description}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <span className="flex items-center text-blue-500">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-500">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex justify-end gap-4">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.wind} m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
