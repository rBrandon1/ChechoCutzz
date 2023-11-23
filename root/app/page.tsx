"use client";
import "./globals.css";
import { useEffect } from "react";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function Home() {
  const { user, permissions } = useKindeBrowserClient();

  const createUser = async (userData: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to create data.");
      return await res.json();
    } catch (e) {
      return console.log("Error" + e);
    }
  };

  useEffect(() => {
    if (user) {
      const userData = {
        id: user?.id,
        email: user?.email,
        firstName: user?.given_name,
        lastName: user?.family_name,
        role: permissions?.includes("admin") ? "admin" : "user",
      };
      createUser(userData);
    }
  }, [user, permissions]);

  return (
    <div>
      <div className="h-[400px] flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#141E30]/75 to-[#243B55]/75 shadow-2xl shadow-[#243B55] rounded-md ">
        <div className="text-2xl md:text-4xl font-bold">
          <h1>Welcome to Checho Cutzz</h1>
        </div>
        <div className="mt-5 flex justify-center">
          <Button asChild className="w-72">
            <Link href="/book-appointment" target="_blank" rel="noreferrer">
              Book now
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-32">
        <div className="font-bold text-4xl mb-5">
          <span className="flex items-center">
            <h1 className="italic">Gallery</h1>
            <a
              href="https://www.instagram.com/checho.cutzz/"
              target="_blank"
              rel="noreferrer"
              className="ml-5"
            >
              <InstagramLogoIcon className="h-8 w-8 text-[rgb(230,50,105)]" />
            </a>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full h-auto max-w-md mx-auto">
            <img
              src="https://picsum.photos/200"
              alt="Description"
              className="object-contain w-full h-full rounded-md"
            />
          </div>
          <div className="w-full h-auto max-w-md mx-auto">
            <img
              src="https://picsum.photos/200"
              alt="Description"
              className="object-contain w-full h-full rounded-md"
            />
          </div>
          <div className="w-full h-auto max-w-md mx-auto">
            <img
              src="https://picsum.photos/200"
              alt="Description"
              className="object-contain w-full h-full rounded-md"
            />
          </div>
          <div className="w-full h-auto max-w-md mx-auto">
            <img
              src="https://picsum.photos/200"
              alt="Description"
              className="object-contain w-full h-full rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
