import { NextResponse, type NextRequest } from "next/server";

// A chave fica só no servidor. NEXT_PUBLIC_ continua aceito para não quebrar deploys antigos,
// mas como o código do navegador não a referencia mais, ela não vai para o bundle.
const API_KEY = process.env.OPENWEATHER_API_KEY ?? process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const ENDPOINTS = {
  weather: "https://api.openweathermap.org/data/2.5/weather",
  forecast: "https://api.openweathermap.org/data/2.5/forecast",
  reverse: "https://api.openweathermap.org/geo/1.0/reverse",
  search: "https://api.openweathermap.org/geo/1.0/direct",
} as const;

type Kind = keyof typeof ENDPOINTS;

function coord(value: string | null, max: number) {
  const n = Number(value);
  return value !== null && Number.isFinite(n) && Math.abs(n) <= max ? n : null;
}

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "Chave da OpenWeather não configurada no servidor." }, { status: 500 });
  }

  const params = req.nextUrl.searchParams;
  const kind = params.get("type") as Kind | null;
  if (!kind || !(kind in ENDPOINTS)) {
    return NextResponse.json({ error: "Tipo de consulta inválido." }, { status: 400 });
  }

  const query = new URLSearchParams({ appid: API_KEY });

  if (kind === "search") {
    const q = (params.get("q") ?? "").trim().slice(0, 80);
    if (q.length < 2) return NextResponse.json({ error: "Busca muito curta." }, { status: 400 });
    query.set("q", q);
    query.set("limit", "5");
  } else {
    const lat = coord(params.get("lat"), 90);
    const lon = coord(params.get("lon"), 180);
    if (lat === null || lon === null) {
      return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
    }
    query.set("lat", lat.toFixed(4));
    query.set("lon", lon.toFixed(4));
    if (kind === "reverse") query.set("limit", "1");
    else {
      query.set("units", "metric");
      query.set("lang", "pt_br");
    }
  }

  const upstream = await fetch(`${ENDPOINTS[kind]}?${query}`, { next: { revalidate: 600 } });
  if (!upstream.ok) {
    return NextResponse.json({ error: `OpenWeather respondeu ${upstream.status}.` }, { status: 502 });
  }

  return NextResponse.json(await upstream.json(), {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
