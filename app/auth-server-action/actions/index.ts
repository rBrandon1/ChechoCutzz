"use server";
import createServerSupabaseClient from "@/lib/supabase/server";

export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
  confirm: string;
  firstName: string;
  lastName: string;
  role: "user";
  picture?: string | undefined;
}) {
  const supabase = await createServerSupabaseClient();

  const result = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        picture: data.picture,
      },
    },
  });

  console.log("result >", JSON.stringify(result.data.user?.user_metadata));
  return JSON.stringify(result);
}

export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  const supabase = await createServerSupabaseClient();

  const result = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  console.log("result", JSON.stringify(result.data.user?.user_metadata));

  return JSON.stringify(result);
}
