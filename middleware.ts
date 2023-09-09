import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./utils/supabase";

export const config = {
  matcher: ["/room/:path*"],
};

export async function middleware(req: NextRequest) {
  const session = await supabase.auth.getSession();
  console.log({ session });
  if (session) return NextResponse.next();
  const url = req.nextUrl;
  url.pathname = "/";
  return NextResponse.redirect(url);
}
