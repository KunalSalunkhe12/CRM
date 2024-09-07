import {
  UsersIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  Smile,
} from "lucide-react";

import TimeSelector from "@/components/shared/TimeSelector";
import StatCard from "@/components/shared/StatCard";
import SalesByItem from "@/components/shared/charts/SalesByItem";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  getCustomersWithinTimeFrame,
  getRevenueWithinTimeFrame,
  getSalesWithinTimeFrame,
  getSatisfactionWithinTimeFrame,
} from "@/lib/actions/sales.action";
import SalesByPurchaseMethod from "@/components/shared/charts/SalesByPurchaseMethod";

export default function Home({
  searchParams,
}: {
  searchParams: { period: string };
}) {
  const period = searchParams.period ?? "1w";
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
          title="New Customers"
          getValue={() => getCustomersWithinTimeFrame(period)}
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Revenue"
          getValue={() => getRevenueWithinTimeFrame(period)}
          icon={<DollarSignIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Orders"
          getValue={() => getSalesWithinTimeFrame(period)}
          icon={<ShoppingCartIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Average Satisfaction"
          getValue={() => getSatisfactionWithinTimeFrame(period)}
          icon={<Smile className="h-6 w-6" />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesByItem period={period} />
        <SalesByPurchaseMethod period={period} />
      </div>
    </div>
  );
}
