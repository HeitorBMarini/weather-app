"use client"

import Header from "@/components/header";
import WeatherDashboard from "@/components/pages/weather-dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


export default function Home() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <WeatherDashboard />
      </QueryClientProvider>
    </>
  );
}
