"use server";

import { connectToDatabase } from "../database/mongoose";
import Sale from "../database/sale.model";

export async function getSalesWithinTimeFrame(timeFrame: string) {
  try {
    await connectToDatabase();

    const endDate = new Date("2018-01-01"); // Set to the last date of your dataset
    let startDate;

    // Calculate the start date based on the selected time frame
    switch (timeFrame) {
      case "1w":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "1m":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3m":
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "1y":
        startDate = new Date(endDate);
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        throw new Error("Invalid timeframe specified");
    }

    const query = {
      saleDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const count = await Sale.countDocuments(query);
    console.log(
      `Total sales from ${startDate.toDateString()} to ${endDate.toDateString()}: ${count}`
    );
    return count;
  } catch (error) {
    console.error(error);
    throw new Error("Couldn't fetch sales data");
  }
}
