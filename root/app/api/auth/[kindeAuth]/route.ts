import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

// export const GET = handleAuth();
export async function GET(req: NextRequest, { params }: any) {
  const enpoint = params?.kindeAuth;
  return handleAuth(req, enpoint);
}
