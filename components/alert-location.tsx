import { AlertCircleIcon, MapPin } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Button } from "./ui/button";


export default function AlertLocation() {

  const { error:locationError, getLocation,  } = useGeolocation();
    
    
  return (
    <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Erro de Localização</AlertTitle>
        <AlertDescription>
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} size="sm" className="mt-2">
            <MapPin className="h-4 w-4 mr-2" />
            Permitir Localização
          </Button>
        </AlertDescription>
      </Alert>
  );
}