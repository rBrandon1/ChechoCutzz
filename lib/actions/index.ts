"use server";

import createServerSupabaseClient from "../supabase/server";

export default async function readUserSession() {
  const supabase = await createServerSupabaseClient();

  return supabase.auth.getSession();
}
