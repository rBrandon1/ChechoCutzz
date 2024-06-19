"use server";
import createServerSupabaseClient from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, role, picture } =
    await request.json();

  const supabase = await createServerSupabaseClient();

  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        role,
        picture,
      },
    },
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        id: result.data.user?.id!,
        email,
        firstName,
        lastName,
        password,
        role,
        picture: picture ?? "",
      },
    });
    return NextResponse.json(
      { user },
      {
        status: 200,
        headers: {
          Location: "/",
        },
      }
    );
  } catch (error) {
    console.log("Error creating user in Prisma:", error);
    return NextResponse.json(
      { error: "Error creating user in database" },
      { status: 500 }
    );
  }
}
