"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useFavorites } from "@/hooks/use-favorite";
import { cityHref } from "@/lib/city-url";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type Place = { lat: number; lon: number; name: string; country: string; state?: string };

export default function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const router = useRouter();

  // Espera o usuário parar de digitar antes de consultar a API.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Atalho Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { data: locations, isFetching } = useLocationSearch(debounced);
  const { favorites } = useFavorites();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const go = (place: Place) => {
    addToHistory({ name: place.name, lat: place.lat, lon: place.lon, country: place.country, state: place.state });
    setOpen(false);
    setQuery("");
    router.push(cityHref(place));
  };

  const label = (p: Place) => [p.state, p.country].filter(Boolean).join(", ");
  const searching = debounced.trim().length >= 3;

  return (
    <>
      <Button
        variant="outline"
        className="w-10 justify-center px-0 text-sm text-muted-foreground sm:w-56 sm:justify-start sm:px-3"
        onClick={() => setOpen(true)}
        aria-label="Buscar cidade"
      >
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Buscar cidade…</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-mono text-[10px] lg:inline">Ctrl K</kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput placeholder="Digite o nome da cidade…" value={query} onValueChange={setQuery} />
        <CommandList>
          {searching && isFetching && (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Buscando…
            </div>
          )}
          {searching && !isFetching && <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>}

          {searching && !!locations?.length && (
            <CommandGroup heading="Resultados">
              {locations.map((loc) => (
                <CommandItem key={`${loc.lat}-${loc.lon}`} value={`${loc.lat}-${loc.lon}`} onSelect={() => go(loc)}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>{loc.name}</span>
                  <span className="ml-1 text-sm text-muted-foreground">{label(loc)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!searching && favorites.length > 0 && (
            <CommandGroup heading="Favoritos">
              {favorites.map((city) => (
                <CommandItem key={city.id} value={`fav-${city.id}`} onSelect={() => go(city)}>
                  <Star className="mr-2 h-4 w-4 text-amber-500" />
                  <span>{city.name}</span>
                  <span className="ml-1 text-sm text-muted-foreground">{label(city)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!searching && history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup
                heading={
                  <span className="flex items-center justify-between">
                    Buscas recentes
                    <button onClick={clearHistory} className="inline-flex items-center gap-1 text-xs hover:text-foreground">
                      <XCircle className="h-3.5 w-3.5" /> Limpar
                    </button>
                  </span>
                }
              >
                {history.map((item) => (
                  <CommandItem key={item.id} value={`hist-${item.id}`} onSelect={() => go(item)}>
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                    <span className="ml-1 text-sm text-muted-foreground">{label(item)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {!searching && !favorites.length && !history.length && (
            <p className="p-4 text-center text-sm text-muted-foreground">Digite pelo menos 3 letras para buscar.</p>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
