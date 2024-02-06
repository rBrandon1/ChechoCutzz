"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  // Function to create or update user in the database
  const createUser = useCallback(async (userData: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.statusText);
      }
      return data;
    } catch (error) {
      console.error("Error creating user in database:", error);
    }
  }, []);

  useEffect(() => {
    // Effect for checking the user session on mount
    const checkUser = async () => {
      const sessionResponse = await supabase.auth.getSession();
      if (sessionResponse?.data?.session) {
        setUser(sessionResponse.data.session.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  useEffect(() => {
    // Effect for setting up the auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        let firstName: string =
          session?.user?.user_metadata?.name.split(" ")[0] || "User";
        let lastName: string =
          session?.user?.user_metadata?.name.split(" ")[1] || "";
        if (event === "SIGNED_IN" && session) {
          setUser(session?.user);
          const userData = {
            id: session.user.id,
            email: session.user.email,
            firstName,
            lastName,
            role: "user",
            picture: session.user.user_metadata?.avatar_url || "",
          };
          createUser(userData);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [createUser]);

  return { user, setUser, isLoading, isAuthenticated };
};

export default useAuth;
