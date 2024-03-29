import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import useAuth from "@/lib/useAuth";

export async function GET() {
  const user = useAuth();
  const dbUser = await prisma.user.findUnique({
    where: { id: user?.user?.id },
  });
  try {
    if (dbUser?.role !== "admin") {
      return NextResponse.json({
        statusText: "Unauthorized",
        status: 401,
      });
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        picture: true,
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
    const { id, email, firstName, lastName, role, picture } = body;

    const newUser = await prisma.user.upsert({
      where: { id },
      update: { email, firstName, lastName, role, picture },
      create: { id, email, firstName, lastName, role, picture },
    });
    return NextResponse.json({
      newUser,
      statusText: "Created",
      statusCode: 201,
    });
  } catch (e: any) {
    return NextResponse.json({ statusText: e?.message, statusCode: 500 });
  }
}
