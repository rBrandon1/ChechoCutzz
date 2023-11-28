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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Badge } from "@/components/ui/badge";
import { roleCheck } from "@/lib/roleCheck";
import { ExclamationTriangleIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { user, isAuthenticated, permissions } = useKindeBrowserClient();
  const userRole = roleCheck(permissions);

  const createUserInDatabase = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          email: user?.email,
          firstName: user?.given_name || user?.email?.split("@")[0],
          lastName: user?.family_name || "",
          role: userRole,
          picture: user?.picture ? (user?.picture as string) : "",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create or update user in database");
      }
    } catch (error: any) {
      console.error("Error creating user in database:", error);
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      createUserInDatabase();
    }
  }, [user, isAuthenticated]);

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-between mx-0 md:mx-8 items-center">
        <div className="flex">
          <h1 className="text-xl font-bold pr-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            <Link href="/">ChechoCutzz</Link>
          </h1>
          <div>
            {userRole === "admin" && (
              <Badge
                variant="outline"
                className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
              >
                Admin
              </Badge>
            )}
          </div>
        </div>
        {!isAuthenticated ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="p-1 bg-primary text-secondary rounded-md">
                Sign in
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle asChild>
                  <div className="flex">
                    <div className="flex items-center flex-grow">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                      <div>Notice</div>
                    </div>
                    <AlertDialogCancel className="border-none  text-muted-foreground m-0 p-0 hover:bg-transparent">
                      <Cross1Icon />
                    </AlertDialogCancel>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-start">
                  To ensure a smooth sign-in experience, please use standard
                  browsers like Safari or Chrome.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction asChild>
                  <LoginLink className="p-1 bg-primary text-secondary rounded-md flex justify-center items-center w-full">
                    Continue
                  </LoginLink>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={user?.picture ? (user?.picture as string) : ""}
                />
                <AvatarFallback>{user?.given_name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-full ">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/appointments">Appointments</Link>
                  </NavigationMenuLink>
                </li>
                <LogoutLink className="p-1 text-destructive rounded-md">
                  Sign out
                </LogoutLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
