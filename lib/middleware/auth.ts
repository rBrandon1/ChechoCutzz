import { NextRequest, NextResponse } from "next/server";

const API_KEYS = [process.env.NEXT_PUBLIC_CUSTOM_API_KEY];

export async function requireApiKey(req: NextRequest) {
  const apiKey = req.headers.get("Authorization")?.replace("apikey ", "");

  if (!apiKey || !API_KEYS.includes(apiKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
