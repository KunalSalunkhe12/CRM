import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  getValue: () => Promise<{ currentCount: number; previousCount: number }>;
}

async function StatCard({ title, icon, getValue }: StatCardProps) {
  const { currentCount, previousCount } = await getValue();
  const change = calculatePercentageChange(currentCount, previousCount);
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentCount}</div>
        <p
          className={`text-xs ${
            isPositive ? "text-green-500" : "text-red-500"
          } flex items-center`}
        >
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change).toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  );
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0; // Avoid division by zero
  const change = ((current - previous) / previous) * 100;
  return change;
}

export default StatCard;
