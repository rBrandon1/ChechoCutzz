"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./globals.css";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { roleCheck } from "@/lib/roleCheck";

export default function Home() {
  const { user, isLoading, permissions } = useKindeBrowserClient();
  const userRole = roleCheck();

  const createUser = async (userData: any) => {
    try {
      const res = await fetch("http://localhost:3000/api/users", {
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
        name: user?.given_name,
        role: permissions?.includes("admin") ? "admin" : "user",
      };
      createUser(userData);
    }
  }, [user]);

  return (
    <div className="">
      <div className="">
        <p className="">Thiccest, Juiciest barber in all of Mexico.</p>
        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          <p>
            {user?.given_name} + {userRole}
          </p>
        )}
        <Link
          href="/book-appointment"
          target="_blank"
          rel="noreferrer"
          className=""
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
