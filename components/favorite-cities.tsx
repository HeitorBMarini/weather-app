"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFavorites } from "@/hooks/use-favorite";
import { FavoriteCityTablet } from "./favorite-city-tablet";

export default function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites.length) return null;

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favoritos</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={() => removeFavorite.mutate(city.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
}
