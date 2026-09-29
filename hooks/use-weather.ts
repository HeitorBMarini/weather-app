import { useQuery } from "@tanstack/react-query";
import { weatherAPI } from "@/api/weather";
import type { Coordinates } from "@/api/types";

const round = (c: Coordinates) => ({ lat: Number(c.lat.toFixed(3)), lon: Number(c.lon.toFixed(3)) });

export const WEATHER_KEYS = {
  weather: (c: Coordinates) => ["weather", round(c)] as const,
  forecast: (c: Coordinates) => ["forecast", round(c)] as const,
  location: (c: Coordinates) => ["location", round(c)] as const,
  search: (query: string) => ["location-search", query] as const,
};

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.getCurrentWeather(coordinates!),
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.getForecast(coordinates!),
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null, enabled = true) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherAPI.reverseGeocode(coordinates!),
    enabled: !!coordinates && enabled,
  });
}

export function useLocationSearch(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: WEATHER_KEYS.search(q),
    queryFn: () => weatherAPI.searchLocations(q),
    enabled: q.length >= 3,
    staleTime: 60 * 60 * 1000,
  });
}
