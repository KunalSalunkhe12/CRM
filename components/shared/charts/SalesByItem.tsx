"use client";

// import { TrendingUp } from "lucide-react";
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
import { getSalesByItem, IgetSalesByItem } from "@/lib/actions/charts.action";

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
      const result = await getSalesByItem(period);
      setChartData(result);
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
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
            <Bar dataKey="totalSales" fill="var(--color-totalSales)" radius={8}>
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
