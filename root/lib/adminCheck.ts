export function isAdmin(userEmail: string): boolean {
  const admins = process.env.ADMIN_EMAILS?.split(", ");
  return admins?.includes(userEmail) ?? false;
}
