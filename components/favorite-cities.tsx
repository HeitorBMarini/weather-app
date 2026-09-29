"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFavorites } from "@/hooks/use-favorite";
import { FavoriteCityTablet } from "./favorite-city-tablet";

export default function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();
  if (!favorites.length) return null;

  return (
    <section aria-label="Cidades favoritas">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Favoritas</h2>
      <ScrollArea className="w-full pb-3">
        <div className="flex gap-3">
          {favorites.map((city) => (
            <FavoriteCityTablet key={city.id} city={city} onRemove={() => removeFavorite(city.id)} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
