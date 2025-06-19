"use client"

import Header from "@/components/header";
import WeatherDashboard from "@/components/pages/weather-dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  
  },
});


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
