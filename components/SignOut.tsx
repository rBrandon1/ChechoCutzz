import createServerSupabaseClient from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

export default function SignOut() {
  const signOut = async () => {
    "use server";
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect("/auth-server-action");
  };
  return (
    <form action={signOut}>
      <Button>Sign out</Button>
    </form>
  );
}
