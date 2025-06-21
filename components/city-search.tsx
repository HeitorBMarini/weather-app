"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Search,
  Loader2,
  Clock,
  Star,
  XCircle,
} from "lucide-react";

import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useFavorites } from "@/hooks/use-favorite";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export default function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { favorites } = useFavorites();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [latStr, lonStr, name, country] = cityData.split("|");

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (!lat || !lon || !name || !country) return;

    addToHistory.mutate({
      query,
      name,
      lat,
      lon,
      country,
    });

    setOpen(false);
    router.push(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Buscar cidade...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Digite o nome da cidade..."
            value={query}
            onValueChange={setQuery}
          />

          <CommandList>
            {query.length > 2 && !isLoading && (
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
            )}

            {/* Favoritos */}
            {favorites.length > 0 && (
              <CommandGroup heading="Favoritos">
                {favorites.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{city.name}</span>
                    {city.state && (
                      <span className="text-sm text-muted-foreground">, {city.state}</span>
                    )}
                    <span className="text-sm text-muted-foreground">, {city.country}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Histórico de busca */}
            {history.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between px-2 my-2">
                    <p className="text-xs text-muted-foreground">Buscas recentes</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearHistory.mutate()}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Limpar
                    </Button>
                  </div>

                  {history.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{item.name}</span>
                      {item.state && (
                        <span className="text-sm text-muted-foreground">, {item.state}</span>
                      )}
                      <span className="text-sm text-muted-foreground">, {item.country}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {format(new Date(item.searchedAt), "dd/MM - HH:mm", { locale: ptBR })}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Sugestões da busca */}
            <CommandSeparator />
            {locations && locations.length > 0 && (
              <CommandGroup heading="Sugestões">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {locations.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">, {location.state}</span>
                    )}
                    <span className="text-sm text-muted-foreground">, {location.country}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
