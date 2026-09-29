import { useCallback, useEffect, useState } from "react";
import type { Coordinates } from "@/lib/api/types";

export const FALLBACK_LOCATION = { lat: -23.5505, lon: -46.6333, name: "São Paulo" };

type Status = "loading" | "granted" | "denied" | "unsupported";

/** Pede a localização do navegador; se falhar, o painel usa FALLBACK_LOCATION em vez de travar numa tela de erro. */
export function useGeolocation(enabled = true) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const getLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ lat: position.coords.latitude, lon: position.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  }, []);

  useEffect(() => {
    if (enabled) getLocation();
  }, [enabled, getLocation]);

  return { coordinates, status, getLocation };
}
