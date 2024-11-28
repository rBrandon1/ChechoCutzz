"use server";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: "Failed to sign out" },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    return NextResponse.json(
      { message: "Signed out successfully" },
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during sign out" },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
