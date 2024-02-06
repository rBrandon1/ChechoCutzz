import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: undefined,
      set: undefined,
      remove: undefined,
    },
  });

  const { data } = await supabase?.auth.getUser();

  if (data) {
    const user = data?.user;
    const { data: any } = await supabase
      .from("User") // Ensure you have a profiles table linked to your users
      .select("role")
      .eq("id", user?.id)
      .single();

    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin",
};
