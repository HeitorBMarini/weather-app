import { createStoredList } from "./use-stored-list";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

const store = createStoredList<FavoriteCity>("favorites");

export const favoriteId = (lat: number, lon: number) => `${lat.toFixed(3)}:${lon.toFixed(3)}`;

export function useFavorites() {
  const favorites = store.use();

  return {
    favorites,
    isFavorite: (lat: number, lon: number) => favorites.some((c) => c.id === favoriteId(lat, lon)),
    addFavorite: (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const id = favoriteId(city.lat, city.lon);
      const current = store.get();
      if (current.some((c) => c.id === id)) return;
      store.set([...current, { ...city, id, addedAt: Date.now() }]);
    },
    removeFavorite: (id: string) => store.set(store.get().filter((c) => c.id !== id)),
  };
}
