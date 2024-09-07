"use client";

import { useState, useEffect, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IgetSalesByPurchaseMethod } from "@/lib/database/charts";
import Loader from "../Loader";

export const description = "A donut chart with text";

const chartConfig = {
  sales: {
    label: "Sales",
  },
  online: {
    label: "Online",
    color: "hsl(var(--chart-2))",
  },
  store: {
    label: "Store",
    color: "hsl(var(--chart-3))",
  },
  phone: {
    label: "Phone",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function SalesByPurchaseMethod({ period }: { period: string }) {
  const [chartData, setChartData] = useState<IgetSalesByPurchaseMethod[]>([]);
  const totalSales = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.sales, 0);
  }, [chartData]);

  useEffect(() => {
    const getChartData = async () => {
      const result = await fetch(`/api/get-sales-by-purchase?period=${period}`);
      const data = await result.json();
      console.log(data);
      setChartData(data);
    };
    getChartData();
  }, [period]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sales by Purchase Method</CardTitle>
        <CardDescription>
          Distribution of Online vs. In-Store Sales vs. Phone
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="sales"
                nameKey="purchaseMethod"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalSales.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Sales
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <Loader />
        )}
      </CardContent>
    </Card>
  );
}
