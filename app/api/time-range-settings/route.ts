import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await prisma.timeRangeSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving time settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { weekdayStart, weekdayEnd, weekendStart, weekendEnd } =
      await req.json();
    const settings = await prisma.timeRangeSettings.upsert({
      where: { id: 1 },
      update: {
        weekdayStart,
        weekdayEnd,
        weekendStart,
        weekendEnd,
      },
      create: {
        weekdayStart,
        weekdayEnd,
        weekendStart,
        weekendEnd,
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating time settings" },
      { status: 500 }
    );
  }
}
