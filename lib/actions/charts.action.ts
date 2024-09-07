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
      { $unwind: "$items" },
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
