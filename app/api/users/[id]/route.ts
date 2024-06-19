import { requireApiKey } from "@/lib/middleware/auth";
import createServerSupabaseClient from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireApiKey(request);
  if (unauthorized) {
    return unauthorized;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.email === "haha@gmail.com") {
      console.log("YES");
      await prisma.user.update({
        where: { email: "haha@gmail.com" },
        data: { role: "user" },
      });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.log("Error fetching user from Prisma:", error);
    return NextResponse.json(
      { error: "Error fetching user from database" },
      { status: 500 }
    );
  }
}
