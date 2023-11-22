export function roleCheck(perms: string[] | null) {
  const userRole = perms?.includes("admin") ? "admin" : "user";
  return userRole;
}
