import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    const { getAccessToken } = getKindeServerSession();
    const accessToken: any = await getAccessToken();
    if (!accessToken?.permissions?.includes("admin")) {
      return NextResponse.json({ statusText: "Forbidden", statusCode: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json({
      users,
      statusText: "OK",
      statusCode: 200,
    });
  } catch (e: any) {
    return NextResponse.json({
      statusText: e.message,
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: any = await req.json();
    const { id, email, firstName, lastName, role } = body;

    const newUser = await prisma.user.upsert({
      where: { id },
      update: { email, firstName, lastName, role },
      create: { id, email, firstName, lastName, role },
    });
    return NextResponse.json({
      newUser,
      statusText: "Created",
      statusCode: 201,
    });
  } catch (e: any) {
    return NextResponse.json({ statusText: e.message, statusCode: 500 });
  }
}
