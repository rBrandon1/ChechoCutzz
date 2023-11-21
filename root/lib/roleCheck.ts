"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export function roleCheck() {
  const { permissions, isLoading } = useKindeBrowserClient();
  const userRole = permissions?.includes("admin") ? "admin" : "user";
  if (isLoading) {
    return null;
  }
  return userRole;
}
