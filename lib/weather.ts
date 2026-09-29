import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
