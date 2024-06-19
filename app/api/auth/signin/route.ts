"use server";
import createServerSupabaseClient from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const supabase = await createServerSupabaseClient();

  const result = await supabase.auth.signInWithPassword({ email, password });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(
    { user: result.data.user },
    {
      status: 200,
      headers: {
        Location: "/",
      },
    }
  );
}
