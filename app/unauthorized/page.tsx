"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1 className="text-lg">You are not authorized to view this page.</h1>
      <p className="text-sm">You will be redirected to the home page...</p>
    </div>
  );
}
