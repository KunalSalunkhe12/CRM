"use client";

import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  UsersIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  PhoneIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import TimeSelector from "@/components/shared/TimeSelector";
import StatCard from "@/components/shared/StatCard";
import { ThemeContext } from "@/context/Theme";

interface DataPoint {
  name: string;
  sales: number;
  customers: number;
}

interface PieDataPoint {
  name: string;
  value: number;
}

interface GeneratedData {
  pieData: PieDataPoint[];
  lineData: DataPoint[];
  stats: {
    customers: number;
    revenue: number;
    orders: number;
    tickets: number;
  };
}

const generateData = (period: string): GeneratedData => {
  const multiplier =
    {
      "1d": 1,
      "1w": 7,
      "1m": 30,
      "3m": 90,
      "1y": 365,
    }[period] || 1;

  return {
    pieData: [
      { name: "Product A", value: 400 * multiplier },
      { name: "Product B", value: 300 * multiplier },
      { name: "Product C", value: 200 * multiplier },
      { name: "Product D", value: 100 * multiplier },
    ],
    lineData: [
      { name: "Jan", sales: 4000 * multiplier, customers: 2400 * multiplier },
      { name: "Feb", sales: 3000 * multiplier, customers: 1398 * multiplier },
      { name: "Mar", sales: 2000 * multiplier, customers: 9800 * multiplier },
      { name: "Apr", sales: 2780 * multiplier, customers: 3908 * multiplier },
      { name: "May", sales: 1890 * multiplier, customers: 4800 * multiplier },
      { name: "Jun", sales: 2390 * multiplier, customers: 3800 * multiplier },
    ],
    stats: {
      customers: 1234 * multiplier,
      revenue: 56789 * multiplier,
      orders: 890 * multiplier,
      tickets: 23 * multiplier,
    },
  };
};

export function CrmStatistics() {
  const data = generateData("1w");
  const { theme, COLORS } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen bg-white dark:bg-background text-black dark:text-foreground p-4 sm:p-6 lg:p-8`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">CRM Dashboard</h1>
        <div className="flex items-center space-x-4">
          <TimeSelector />
          <ThemeToggle />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Customers"
          value={data.stats.customers.toLocaleString()}
          icon={<UsersIcon className="h-6 w-6" />}
          change={12}
        />
        <StatCard
          title="Revenue"
          value={`$${data.stats.revenue.toLocaleString()}`}
          icon={<DollarSignIcon className="h-6 w-6" />}
          change={-5}
        />
        <StatCard
          title="Orders"
          value={data.stats.orders.toLocaleString()}
          icon={<ShoppingCartIcon className="h-6 w-6" />}
          change={8}
        />
        <StatCard
          title="Support Tickets"
          value={data.stats.tickets.toLocaleString()}
          icon={<PhoneIcon className="h-6 w-6" />}
          change={-3}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[theme][index % COLORS[theme].length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales and Customers Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.lineData}>
                  <XAxis dataKey="name" stroke="currentColor" />
                  <YAxis yAxisId="left" stroke="currentColor" />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="currentColor"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke={COLORS[theme][0]}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="customers"
                    stroke={COLORS[theme][1]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
