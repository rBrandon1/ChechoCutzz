"use server";
import { prisma } from "@/lib/prisma";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json(
        { error: "No active session" },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    // Return user data without sensitive information
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get session" },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
