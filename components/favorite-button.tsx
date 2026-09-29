"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import type { WeatherData } from "@/api/types";
import { favoriteId, useFavorites } from "@/hooks/use-favorite";

export default function FavoriteButton({ data, name }: { data: WeatherData; name: string }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { lat, lon } = data.coord;
  const active = isFavorite(lat, lon);

  const toggle = () => {
    if (active) {
      removeFavorite(favoriteId(lat, lon));
      toast(`${name} saiu dos favoritos`);
    } else {
      addFavorite({ name, lat, lon, country: data.sys.country });
      toast.success(`${name} adicionada aos favoritos`);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
    >
      <Star className={`h-5 w-5 ${active ? "fill-amber-300 text-amber-300" : "text-white"}`} />
    </button>
  );
}
