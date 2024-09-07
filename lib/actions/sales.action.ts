"use server";

import { connectToDatabase } from "../database/mongoose";
import Sale from "../database/sale.model";
import { calculateStartDate } from "../utils";

// Set the end date to 1st January 2018 for this example
const endDate = new Date("2018-01-01");

export async function getCustomersWithinTimeFrame(
  timeFrame: string
): Promise<number> {
  try {
    await connectToDatabase();

    const startDate = calculateStartDate(endDate, timeFrame);
    const pipeline = [
      // Filter by date range
      {
        $match: {
          "customer.joined": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      //Group by unique customer email to count unique customers
      {
        $group: {
          _id: "$customer.email",
        },
      },
      // Count the number of unique customers
      {
        $count: "uniqueCustomers",
      },
    ];

    const result = await Sale.aggregate(pipeline);

    return result.length > 0 ? result[0].uniqueCustomers : 0;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch Customers data");
  }
}

export async function getSalesWithinTimeFrame(
  timeFrame: string
): Promise<number> {
  try {
    await connectToDatabase();

    const startDate = calculateStartDate(endDate, timeFrame);

    const query = {
      saleDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const count = await Sale.countDocuments(query);
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch sales data");
  }
}

export async function getRevenueWithinTimeFrame(
  timeFrame: string
): Promise<number> {
  try {
    await connectToDatabase();

    const startDate = calculateStartDate(endDate, timeFrame);

    const pipeline = [
      // Filter by date range
      {
        $match: {
          saleDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      // Unwind items array
      {
        $unwind: "$items",
      },
      // Group by null to get total revenue
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: [
                { $toDouble: "$items.price" },
                { $toInt: "$items.quantity" },
              ],
            },
          },
        },
      },
    ];

    const result = await Sale.aggregate(pipeline);

    return result.length > 0 ? result[0].totalRevenue.toFixed(2) : 0;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch revenue data");
  }
}

export async function getSatisfactionWithinTimeFrame(
  timeFrame: string
): Promise<number> {
  try {
    await connectToDatabase();

    const startDate = calculateStartDate(endDate, timeFrame);
    const pipeline = [
      // Filter by date range
      {
        $match: {
          saleDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      // Calculate the average customer satisfaction
      {
        $group: {
          _id: null,
          averageSatisfaction: { $avg: { $toInt: "$customer.satisfaction" } },
        },
      },
    ];

    const result = await Sale.aggregate(pipeline);
    return result.length > 0 ? result[0].averageSatisfaction.toFixed(1) : 0;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch Customers data");
  }
}
