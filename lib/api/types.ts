export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility?: number;
  clouds?: { all: number };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  /** Deslocamento do fuso da cidade em segundos, em relação ao UTC. */
  timezone: number;
  name: string;
  dt: number;
}

export interface ForecastItem {
  dt: number;
  main: WeatherData["main"] & { dew_point?: number };
  weather: WeatherData["weather"];
  wind: WeatherData["wind"];
  clouds?: { all: number };
  visibility?: number;
  /** Probabilidade de precipitação, de 0 a 1. */
  pop?: number;
  /** Volume de chuva nas últimas 3 horas, em mm. */
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  sys?: { pod: "d" | "n" };
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
}
