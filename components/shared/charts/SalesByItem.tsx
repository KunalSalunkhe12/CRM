"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { IgetSalesByItem } from "@/lib/database/charts";
import Loader from "../Loader";

export const description = "Sales By Item";

const chartConfig = {
  totalSales: {
    label: "Total Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function SalesByItem({ period }: { period: string }) {
  const [chartData, setChartData] = useState<IgetSalesByItem[]>([]);

  useEffect(() => {
    const getChartData = async () => {
      const result = await fetch(`/api/get-sales-by-item?period=${period}`);
      const data = await result.json();
      setChartData(data);
    };
    getChartData();
  }, [period]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{description}</CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="totalSales"
                fill="var(--color-totalSales)"
                radius={8}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  formatter={(value: number) => value.toFixed(1)}
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <Loader />
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
