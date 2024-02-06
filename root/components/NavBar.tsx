"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import useAuth from "@/lib/useAuth";

export default function NavBar() {
  const supabase = createClient();
  const { user } = useAuth();

  const handleLogin = async () => {
    await supabase?.auth?.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    const { error } = await supabase?.auth?.signOut();
    if (error) {
      console.error("Error logging out user:", error);
    }
    console.log("User: ", user?.id, " has signed out");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-between mx-0 md:mx-8 items-center">
        <div className="flex">
          <h1 className="text-xl font-bold pr-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            <Link href="/">ChechoCutzz</Link>
          </h1>
        </div>
        {!user ? (
          <Button
            onClick={handleLogin}
            className="p-1 bg-primary text-secondary rounded-md"
          >
            Sign in
          </Button>
        ) : (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback>
                  {user?.user_metadata?.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-full">
                <li>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/appointments" className="hover:underline">
                      Appointments
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <button
                    className="bg-transparent text-destructive hover:underline"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
