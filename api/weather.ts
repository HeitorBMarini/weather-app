import { API_CONFIG } from "./config";
import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "./types";

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const apiKey = API_CONFIG.API_KEY;

    if (!apiKey) {
      throw new Error("API key is missing. Please check your environment variables.");
    }

    // Garantir que todos os valores sejam string
    const processedParams: Record<string, string> = {};
    for (const key in params) {
      processedParams[key] = String(params[key]);
    }

    // Adiciona a chave da API
    processedParams["appid"] = apiKey;

    const searchParams = new URLSearchParams(processedParams);
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}weather`, {
      lat,
      lon,
      units: "metric",
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}forecast`, {
      lat,
      lon,
      units: "metric",
    });
    return this.fetchData<ForecastData>(url);
  }

  async reverseGeocode({ lat, lon }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat,
      lon,
      limit: 1,
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: 5,
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
