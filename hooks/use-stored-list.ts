import { useSyncExternalStore } from "react";

/**
 * Lista persistida no localStorage e compartilhada entre todos os componentes
 * (o antigo useLocalStorage criava um estado separado por componente).
 */
export function createStoredList<T>(key: string) {
  const listeners = new Set<() => void>();
  const empty: T[] = [];
  let cache: { raw: string | null; value: T[] } = { raw: null, value: empty };

  const read = (): T[] => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return empty;
    }
    if (raw !== cache.raw) {
      try {
        cache = { raw, value: raw ? (JSON.parse(raw) as T[]) : empty };
      } catch {
        cache = { raw, value: empty };
      }
    }
    return cache.value;
  };

  const write = (value: T[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => e.key === key && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  return {
    use: () => useSyncExternalStore(subscribe, read, () => empty),
    get: read,
    set: write,
  };
}
