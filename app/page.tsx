import { Suspense } from "react";
import Header from "@/components/header";
import WeatherDashboard from "@/components/pages/weather-dashboard";
import WeatherSkeleton from "@/components/loading-skeleton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* O painel lê a cidade da URL (useSearchParams), por isso fica dentro de Suspense. */}
        <Suspense fallback={<WeatherSkeleton />}>
          <WeatherDashboard />
        </Suspense>
      </main>
      <footer className="container mx-auto px-4 pb-8 text-xs text-muted-foreground">
        Dados de <a className="underline underline-offset-2" href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeather</a>.
      </footer>
    </>
  );
}
