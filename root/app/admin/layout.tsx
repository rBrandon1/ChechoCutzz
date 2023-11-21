import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getPermissions } = getKindeServerSession();
  if (!(await isAuthenticated())) return <div>Loading...</div>;
  if (!(await getPermissions()).permissions.includes("admin")) {
    return (
      <div>
        <p>
          You are not an admin, please log in with an account that has admin
          privileges.
        </p>
      </div>
    );
  }
  return <section>{children}</section>;
}
