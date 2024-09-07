import { NextRequest, NextResponse } from "next/server";
import { getSalesByPurchaseMethod } from "@/lib/database/charts";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const period = searchParams.get("period");

  if (!period) {
    return new NextResponse("Please provide period Search param", {
      status: 400,
    });
  }

  const data = await getSalesByPurchaseMethod(period);

  return NextResponse.json(data);
}
