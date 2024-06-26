"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import readUserSession from "@/lib/actions";
import { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
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
      <NavigationMenuList className="flex justify-between w-full">
        <h1 className="text-xl italic tracking-[.15em]">
          <Link href="/">ChechoCutzz</Link>
        </h1>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Button className="text-secondary w-fit ml-2" asChild>
                    <Link href="/my-appointments">My Appointments</Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="text-secondary" asChild>
              <Link href="/auth-server-action">Sign up</Link>
            </Button>
          )}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
