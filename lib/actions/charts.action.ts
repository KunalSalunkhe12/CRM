"use server";

import { connectToDatabase } from "../database/mongoose";
import { calculateStartDate } from "../utils";
import Sale from "../database/sale.model";

// Set the end date to 1st January 2018 for this example
const endDate = new Date("2018-01-01");

export interface IgetSalesByItem {
  name: string;
  totalSales: number;
}

export async function getSalesByItem(
  timeFrame: string
): Promise<IgetSalesByItem[]> {
  try {
    await connectToDatabase();

    const startDate = calculateStartDate(endDate, timeFrame);
    const pipeline = [
      {
        $match: {
          saleDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalSales: 1,
        },
      },
    ];

    const result = await Sale.aggregate(pipeline);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch Customers data");
  }
}

export interface IgetSalesByPurchaseMethod {
  purchaseMethod: string;
  sales: number;
  fill: string;
}

export async function getSalesByPurchaseMethod(
  timeFrame: string
): Promise<IgetSalesByPurchaseMethod[]> {
  try {
    await connectToDatabase();

    const startDate = calculateStartDate(endDate, timeFrame); // Calculate the start date based on the timeframe
    const pipeline = [
      {
        $match: {
          saleDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$purchaseMethod", // Group by purchaseMethod
          sales: { $sum: 1 }, // Count the number of sales for each method
        },
      },
      {
        $project: {
          _id: 0,
          purchaseMethod: "$_id",
          sales: 1,
          fill: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$_id", "Online"] },
                  then: "var(--color-online)",
                },
                {
                  case: { $eq: ["$_id", "Store"] },
                  then: "var(--color-store)",
                },
                {
                  case: { $eq: ["$_id", "Phone"] },
                  then: "var(--color-phone)",
                },
              ],
              default: "var(--color-other)",
            },
          },
        },
      },
    ];

    const result = await Sale.aggregate(pipeline);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch sales by purchase method data");
  }
}
