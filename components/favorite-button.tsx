"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeatherData } from "@/api/types";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";

interface FavoriteButtonProps {
  data: WeatherData & { name: string }; 
}

export default function FavoriteButton({ data }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removido ${data.name} dos favoritos`);
    } else {
      addFavorite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Adicionado ${data.name} aos favoritos`);
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size="icon"
      onClick={handleToggleFavorite}
      className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      title={
        isCurrentlyFavorite
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Star
        className={`h-4 w-4 ${
          isCurrentlyFavorite ? "fill-yellow-900 text-white" : ""
        }`}
      />
    </Button>
  );
}
