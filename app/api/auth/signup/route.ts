"use server";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, role, picture } =
    await request.json();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const supabase = await createServerSupabaseClient();

    // Create user in Supabase
    const { data: supabaseUser, error: supabaseError } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

    if (supabaseError) throw supabaseError;

    // Create user in Prisma
    const prismaUser = await prisma.user.create({
      data: {
        id: supabaseUser.user!.id,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        picture: picture ?? "",
      },
    });

    return NextResponse.json({ user: prismaUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
