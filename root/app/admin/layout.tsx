import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin page",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getPermissions } = getKindeServerSession();
  if (!(await getPermissions())?.permissions.includes("admin")) {
    return (
      <div>
        <p className="text-red-500">
          You are not an admin, please log in with an account that has admin
          privileges.
        </p>
      </div>
    );
  }
  if (!(await isAuthenticated())) return <div>Loading...</div>;

  return <section>{children}</section>;
}
