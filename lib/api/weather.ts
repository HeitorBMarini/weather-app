import type { WeatherData, ForecastData, GeocodingResponse, Coordinates } from "./types";

// O navegador conversa só com a nossa rota; a chave da OpenWeather fica no servidor.
async function request<T>(params: Record<string, string | number>): Promise<T> {
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const response = await fetch(`/api/weather?${query}`);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Erro ${response.status} ao buscar o clima.`);
  }
  return response.json();
}

export const weatherAPI = {
  getCurrentWeather: ({ lat, lon }: Coordinates) => request<WeatherData>({ type: "weather", lat, lon }),
  getForecast: ({ lat, lon }: Coordinates) => request<ForecastData>({ type: "forecast", lat, lon }),
  reverseGeocode: ({ lat, lon }: Coordinates) => request<GeocodingResponse[]>({ type: "reverse", lat, lon }),
  searchLocations: (q: string) => request<GeocodingResponse[]>({ type: "search", q }),
};
