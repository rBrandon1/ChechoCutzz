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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Badge } from "@/components/ui/badge";
import { roleCheck } from "@/lib/roleCheck";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

export default function NavBar() {
  const { user, isAuthenticated, permissions } = useKindeBrowserClient();
  const userRole = roleCheck(permissions);

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
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="p-1 bg-primary text-secondary rounded-md">
                  Sign in
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle asChild>
                    <div className="flex justify-center items-center">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                      <div>Notice</div>
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
          </div>
        ) : (
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.picture as string} />
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
