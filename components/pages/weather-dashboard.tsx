import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import WeatherSkeleton from "../loading-skeleton";

export default function WeatherDashboard() {
  const { coordinates, error:locationError, getLocation, isLoading:locationLoading } = useGeolocation();

  const handleRefresh = () => {
    getLocation();
    if(coordinates) {
      console.log("Current Coordinates:", coordinates);
    }
  };

  if (locationLoading) {
    <WeatherSkeleton />;
  }

  return (
    <div className="container items-center mx-auto p-4">
      <div className="flex justify-between">
        <h2 className="mb-2 font-bold text-xl tracking-tight">My Location</h2>
        <Button
          variant={"outline"}
          size={"icon"}
          //</div> onClick={handleRefresh}
          disabled={false}
          className="mb-4"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
