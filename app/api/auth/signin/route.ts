"use server";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  const { email, password } = await req.json();

  try {
    // Find the user in the Prisma database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Sign in or create user in Supabase
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Return user data, excluding sensitive information
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword, message: "Sign in successful" },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          Location: "/",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "An error occurred during sign in" },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
