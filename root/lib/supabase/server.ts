import { createServerClient } from "@supabase/ssr";
import { NextApiRequest } from "next";

export function createSupabase(req: NextApiRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          cookie: req.headers.cookie || "",
        },
      },
      cookies: {
        get: undefined,
        set: undefined,
        remove: undefined,
      },
    }
  );
}
