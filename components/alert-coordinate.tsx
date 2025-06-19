import { AlertCircleIcon, MapPin } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Button } from "./ui/button";

export default function AlertCoordinate() {
  const { error: locationError, getLocation } = useGeolocation();

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Localização Necessária</AlertTitle>
      <AlertDescription>
        <p>Por favor, permita a localização para visaulizar.</p>
        <Button
          onClick={getLocation}
          variant={"outline"}
          size="sm"
          className="mt-2"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Permitir Localização
        </Button>
      </AlertDescription>
    </Alert>
  );
}
