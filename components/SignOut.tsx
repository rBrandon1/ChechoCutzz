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
        console.error("Failed to sign out: ", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while siging out", error);
    }
  };

  return (
    <form action={signOut}>
      <Button variant="destructive">Sign out</Button>
    </form>
  );
}
