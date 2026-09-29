import { createStoredList } from "./use-stored-list";

export interface SearchHistoryItem {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

const store = createStoredList<SearchHistoryItem>("search-history");

export function useSearchHistory() {
  const history = store.use();

  return {
    history,
    addToHistory: (item: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
      const rest = store.get().filter((h) => !(h.lat === item.lat && h.lon === item.lon));
      store.set([{ ...item, id: `${item.lat}:${item.lon}`, searchedAt: Date.now() }, ...rest].slice(0, 8));
    },
    clearHistory: () => store.set([]),
  };
}
