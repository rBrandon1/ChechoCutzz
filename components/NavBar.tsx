"use client";

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import readUserSession from "@/lib/actions";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import SignOut from "./SignOut";
import { Button } from "./ui/button";

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await readUserSession();
      setUser(session?.user ?? null);
    };

    fetchUser();
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-between mx-0 md:mx-8 items-center">
        <div className="flex">
          <h1 className="text-xl font-bold pr-4">
            <Link href="/">ChechoCutzz</Link>
          </h1>
        </div>
        <div>
          {user ? (
            <SignOut />
          ) : (
            <Button asChild>
              <Link href="/auth-server-action">Sign up</Link>
            </Button>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
