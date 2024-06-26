"use client";
import { Button } from "./ui/button";

export default function SignOut() {
  const signOut = async () => {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        throw new Error("Failed to sign out");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <form action={signOut}>
      <Button variant="destructive">Sign out</Button>
    </form>
  );
}
