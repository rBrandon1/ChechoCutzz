import readUserSession from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import { AuthForm } from "./components/AuthForm";

export default async function page() {
  const { data } = await readUserSession();
  if (data.session) return redirect("/");

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-96">
        <AuthForm />
      </div>
    </div>
  );
}
