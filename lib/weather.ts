import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ForecastData, ForecastItem } from "./api/types";

/**
 * Formata um horário da API no fuso da cidade consultada (não no do navegador).
 * `dt` e `timezone` vêm em segundos.
 */
export function formatCityTime(dt: number, timezone: number, pattern: string) {
  const utc = new Date((dt + timezone) * 1000);
  const shifted = new Date(utc.getTime() + utc.getTimezoneOffset() * 60_000);
  return format(shifted, pattern, { locale: ptBR });
}

export const formatTemp = (temp?: number) => (typeof temp === "number" ? `${Math.round(temp)}°` : "--");

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function windDirection(degree: number) {
  const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
  return directions[Math.round((((degree % 360) + 360) % 360) / 45) % 8];
}

export const kmh = (ms: number) => Math.round(ms * 3.6);

/** Cores do card principal conforme o clima e se é dia ou noite (ícones da OpenWeather terminam em d/n). */
export function conditionTheme(conditionId: number, icon: string) {
  const night = icon.endsWith("n");
  if (conditionId >= 200 && conditionId < 300) return "from-violet-700 via-indigo-800 to-slate-900";
  if (conditionId >= 300 && conditionId < 600) return night ? "from-slate-800 via-blue-950 to-slate-950" : "from-sky-700 via-slate-600 to-slate-800";
  if (conditionId >= 600 && conditionId < 700) return night ? "from-slate-700 via-slate-800 to-indigo-950" : "from-sky-300 via-slate-300 to-slate-500";
  if (conditionId >= 700 && conditionId < 800) return "from-zinc-500 via-slate-500 to-zinc-700";
  if (conditionId === 800) return night ? "from-indigo-950 via-blue-950 to-slate-900" : "from-sky-400 via-sky-500 to-amber-300";
  return night ? "from-slate-800 via-indigo-950 to-slate-950" : "from-sky-500 via-slate-400 to-slate-600";
}

/** Escala de Beaufort resumida (velocidade em m/s). */
export function windLabel(ms: number) {
  if (ms < 0.5) return "Calmo";
  if (ms < 3.4) return "Brisa leve";
  if (ms < 8) return "Brisa moderada";
  if (ms < 10.8) return "Vento fresco";
  if (ms < 13.9) return "Vento forte";
  if (ms < 17.2) return "Ventania";
  return "Tempestade";
}

export function pressureLabel(hpa: number) {
  if (hpa < 1000) return "Baixa · tempo instável";
  if (hpa > 1022) return "Alta · tempo firme";
  return "Normal";
}

export function humidityLabel(h: number) {
  if (h < 30) return "Ar seco";
  if (h < 60) return "Confortável";
  if (h < 80) return "Úmido";
  return "Muito úmido";
}

export function visibilityLabel(m?: number) {
  if (typeof m !== "number") return "Sem dados";
  if (m >= 10000) return "Excelente";
  if (m >= 5000) return "Boa";
  if (m >= 2000) return "Moderada";
  return "Baixa · neblina";
}

export function cloudLabel(c: number) {
  if (c < 12) return "Céu aberto";
  if (c < 40) return "Poucas nuvens";
  if (c < 75) return "Parcialmente nublado";
  return "Nublado";
}

export function rainLabel(pop: number) {
  if (pop < 0.1) return "Improvável";
  if (pop < 0.4) return "Possível";
  if (pop < 0.7) return "Provável";
  return "Muito provável";
}

/** Ponto de orvalho pela fórmula de Magnus (°C). */
export function dewPoint(temp: number, humidity: number) {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(Math.max(humidity, 1) / 100);
  return (b * alpha) / (a - alpha);
}

export function dewPointLabel(dp: number) {
  if (dp < 10) return "Seco";
  if (dp < 16) return "Agradável";
  if (dp < 20) return "Abafado";
  return "Muito abafado";
}

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}min`;
}

export const formatKm = (m?: number) =>
  typeof m === "number" ? `${(m / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km` : "--";

export const formatMm = (mm: number) => `${mm.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mm`;

export type ForecastDay = {
  key: string;
  dt: number;
  min: number;
  max: number;
  /** Maior probabilidade de chuva do dia, de 0 a 1. */
  rain: number;
  /** Volume total de chuva previsto, em mm. */
  rainMm: number;
  icon: string;
  conditionId: number;
  description: string;
  humidity: number;
  pressure: number;
  clouds: number;
  windMax: number;
  windDeg: number;
  gustMax: number;
  feelsMin: number;
  feelsMax: number;
  items: ForecastItem[];
};

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Agrupa a previsão de 3 em 3 horas por dia, no fuso da cidade. */
export function groupForecastByDay(data: ForecastData): ForecastDay[] {
  const tz = data.city.timezone;
  const groups = new Map<string, ForecastItem[]>();
  for (const item of data.list) {
    const key = formatCityTime(item.dt, tz, "yyyy-MM-dd");
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return [...groups.entries()].map(([key, items]) => {
    // A condição do meio do dia representa melhor o dia; sem ela, a mais frequente.
    const midday = items.find((i) => {
      const h = Number(formatCityTime(i.dt, tz, "H"));
      return h >= 11 && h <= 14;
    });
    const counts = new Map<string, { n: number; item: ForecastItem }>();
    for (const i of items) {
      const c = counts.get(i.weather[0].description) ?? { n: 0, item: i };
      counts.set(i.weather[0].description, { n: c.n + 1, item: c.item });
    }
    const rep = midday ?? [...counts.values()].sort((a, b) => b.n - a.n)[0].item;
    const windiest = items.reduce((a, b) => (b.wind.speed > a.wind.speed ? b : a));

    return {
      key,
      dt: items[0].dt,
      min: Math.min(...items.map((i) => i.main.temp_min)),
      max: Math.max(...items.map((i) => i.main.temp_max)),
      rain: Math.max(...items.map((i) => i.pop ?? 0)),
      rainMm: items.reduce((s, i) => s + (i.rain?.["3h"] ?? 0) + (i.snow?.["3h"] ?? 0), 0),
      icon: rep.weather[0].icon,
      conditionId: rep.weather[0].id,
      description: rep.weather[0].description,
      humidity: Math.round(avg(items.map((i) => i.main.humidity))),
      pressure: Math.round(avg(items.map((i) => i.main.pressure))),
      clouds: Math.round(avg(items.map((i) => i.clouds?.all ?? 0))),
      windMax: windiest.wind.speed,
      windDeg: windiest.wind.deg,
      gustMax: Math.max(...items.map((i) => i.wind.gust ?? i.wind.speed)),
      feelsMin: Math.min(...items.map((i) => i.main.feels_like)),
      feelsMax: Math.max(...items.map((i) => i.main.feels_like)),
      items,
    };
  });
}
