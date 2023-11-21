import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = handleAuth();

// export async function GET(request, { params }) {
//   const endpoint = params.kindeAuth;
//   return handleAuth(request, endpoint);
// }
