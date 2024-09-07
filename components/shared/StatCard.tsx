import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  change: number;
  getValue: () => Promise<number>;
}

async function StatCard({ title, icon, change, getValue }: StatCardProps) {
  const isPositive = change >= 0;
  const value = await getValue();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
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
          {Math.abs(change)}%
        </p>
      </CardContent>
    </Card>
  );
}

export default StatCard;
