export function cityHref(city: { lat: number; lon: number; name: string; country?: string }) {
  const params = new URLSearchParams({
    lat: city.lat.toFixed(4),
    lon: city.lon.toFixed(4),
    name: city.name,
  });
  if (city.country) params.set("country", city.country);
  return `/?${params}`;
}
