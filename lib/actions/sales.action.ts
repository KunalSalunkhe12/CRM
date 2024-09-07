"use server";

import { connectToDatabase } from "../database/mongoose";
import Sale from "../database/sale.model";
import { calculateStartDate } from "../utils";

export interface IActionReturn {
  currentCount: number;
  previousCount: number;
}

// Set the end date to 1st January 2018 for this example
const endDate = new Date("2018-01-01");

export async function getCustomersWithinTimeFrame(
  timeFrame: string
): Promise<IActionReturn> {
  try {
    await connectToDatabase();

    // Current period
    const startDateCurrent = calculateStartDate(endDate, timeFrame);

    // Previous period (e.g., if timeFrame is 'month', this will be the previous month)
    const startDatePrevious = calculateStartDate(startDateCurrent, timeFrame);

    const pipelineCurrent = [
      // Filter by date range
      {
        $match: {
          "customer.joined": {
            $gte: startDateCurrent,
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

    const pipelinePrevious = [
      // Filter by date range
      {
        $match: {
          "customer.joined": {
            $gte: startDatePrevious,
            $lte: startDateCurrent,
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

    // Execute both aggregations
    const [resultCurrent, resultPrevious] = await Promise.all([
      Sale.aggregate(pipelineCurrent),
      Sale.aggregate(pipelinePrevious),
    ]);

    const currentCount =
      resultCurrent.length > 0 ? resultCurrent[0].uniqueCustomers : 0;
    const previousCount =
      resultPrevious.length > 0 ? resultPrevious[0].uniqueCustomers : 0;

    return { currentCount, previousCount };
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch Customers data");
  }
}

export async function getSalesWithinTimeFrame(
  timeFrame: string
): Promise<IActionReturn> {
  try {
    await connectToDatabase();

    const startDateCurrent = calculateStartDate(endDate, timeFrame);
    const startDatePrevious = calculateStartDate(startDateCurrent, timeFrame);

    // Current period query
    const queryCurrent = {
      saleDate: {
        $gte: startDateCurrent,
        $lte: endDate,
      },
    };

    // Previous period query
    const queryPrevious = {
      saleDate: {
        $gte: startDatePrevious,
        $lt: startDateCurrent,
      },
    };

    // Fetch sales count for both periods
    const [currentCount, previousCount] = await Promise.all([
      Sale.countDocuments(queryCurrent),
      Sale.countDocuments(queryPrevious),
    ]);

    return { currentCount, previousCount };
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch sales data");
  }
}

export async function getRevenueWithinTimeFrame(
  timeFrame: string
): Promise<IActionReturn> {
  try {
    await connectToDatabase();

    const startDateCurrent = calculateStartDate(endDate, timeFrame);
    const startDatePrevious = calculateStartDate(startDateCurrent, timeFrame);

    // Current period pipeline
    const pipelineCurrent = [
      { $match: { saleDate: { $gte: startDateCurrent, $lte: endDate } } },
      { $unwind: "$items" },
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

    // Previous period pipeline
    const pipelinePrevious = [
      {
        $match: {
          saleDate: { $gte: startDatePrevious, $lt: startDateCurrent },
        },
      },
      { $unwind: "$items" },
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

    // Execute both aggregations
    const [resultCurrent, resultPrevious] = await Promise.all([
      Sale.aggregate(pipelineCurrent),
      Sale.aggregate(pipelinePrevious),
    ]);

    const currentCount =
      resultCurrent.length > 0
        ? parseFloat(resultCurrent[0].totalRevenue.toFixed(2))
        : 0;
    const previousCount =
      resultPrevious.length > 0
        ? parseFloat(resultPrevious[0].totalRevenue.toFixed(2))
        : 0;

    return { currentCount, previousCount };
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch revenue data");
  }
}

export async function getSatisfactionWithinTimeFrame(
  timeFrame: string
): Promise<IActionReturn> {
  try {
    await connectToDatabase();

    const startDateCurrent = calculateStartDate(endDate, timeFrame);
    const startDatePrevious = calculateStartDate(startDateCurrent, timeFrame);

    // Current period pipeline
    const pipelineCurrent = [
      { $match: { saleDate: { $gte: startDateCurrent, $lte: endDate } } },
      {
        $group: {
          _id: null,
          averageSatisfaction: { $avg: { $toInt: "$customer.satisfaction" } },
        },
      },
    ];

    // Previous period pipeline
    const pipelinePrevious = [
      {
        $match: {
          saleDate: { $gte: startDatePrevious, $lt: startDateCurrent },
        },
      },
      {
        $group: {
          _id: null,
          averageSatisfaction: { $avg: { $toInt: "$customer.satisfaction" } },
        },
      },
    ];

    // Execute both aggregations
    const [resultCurrent, resultPrevious] = await Promise.all([
      Sale.aggregate(pipelineCurrent),
      Sale.aggregate(pipelinePrevious),
    ]);

    const currentCount =
      resultCurrent.length > 0
        ? parseFloat(resultCurrent[0].averageSatisfaction.toFixed(1))
        : 0;
    const previousCount =
      resultPrevious.length > 0
        ? parseFloat(resultPrevious[0].averageSatisfaction.toFixed(1))
        : 0;

    return { currentCount, previousCount };
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch satisfaction data");
  }
}
