import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStartDate(endDate: Date, timeFrame: string) {
  const startDate = new Date(endDate);

  switch (timeFrame) {
    case "1d":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "1w":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "1m":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "3m":
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case "1y":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid timeframe specified");
  }

  return startDate;
}
