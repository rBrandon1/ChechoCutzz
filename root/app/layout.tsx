import "./globals.css";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const metadata = {
  title: "ChechoCutzz",
  description: "Best barber in all of Mexico.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getAccessToken, getUser } = getKindeServerSession();
  const accessToken: any = await getAccessToken();
  const user: any = await getUser();

  return (
    <html lang="en">
      <body>
        <header>
          <nav className="">
            <h1 className="">ChechoCutzz</h1>
            {accessToken?.permissions == "admin" && (
              <span>
                <p className="text-sm text-gray-400">Admin</p>
              </span>
            )}

            <div>
              {!(await isAuthenticated()) ? (
                <>
                  <LoginLink className="btn btn-dark">Sign up</LoginLink>
                </>
              ) : (
                <div className="">
                  {user?.picture ? (
                    <img
                      className=""
                      src={user?.picture}
                      alt="user profile avatar"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="">
                      {user?.given_name?.[0]}
                      {user?.family_name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="">
                      {user?.given_name} {user?.family_name}
                    </p>

                    <LogoutLink className="">Log out</LogoutLink>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="">
            <small className="">coming December 25, 2023.</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
