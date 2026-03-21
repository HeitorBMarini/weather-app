import { ForecastData } from "@/api/types";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface HourlyTemperatureProps {
  data: ForecastData;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

export default function HourlyTemperature({ data }: HourlyTemperatureProps) {
  // Transformando a lista da API para dados do gráfico
  const chartData: ChartData[] = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "HH:mm"),
    temp: item.main.temp,
    feels_like: item.main.feels_like,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperatura nas próximas horas</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Temperatura"
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Sensação Térmica"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Atualizado agora <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando previsão das próximas 24 horas
        </div>
      </CardFooter>
    </Card>
  );
}
