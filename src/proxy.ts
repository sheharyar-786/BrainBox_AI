import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const proxy = NextAuth(authConfig).auth;

export const config = {
  // Protect all routes except static files, assets, and standard api authentication hooks
  matcher: ["/((?!api/auth|_next/static|_next/image|.*\\.png$|favicon\\.ico).*)"],
};
