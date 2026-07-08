import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      
      const isAuthPage = nextUrl.pathname.startsWith("/login") || 
                         nextUrl.pathname.startsWith("/register") || 
                         nextUrl.pathname.startsWith("/forgot-password");
                         
      const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
      const isAdminPage = nextUrl.pathname.startsWith("/dashboard/admin");

      if (isAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isDashboardPage) {
        if (!isLoggedIn) {
          return false; // Redirect to login
        }
        
        // Protect admin routes
        if (isAdminPage && userRole !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        
        return true;
      }

      return true;
    },
  },
  providers: [], // Overridden in auth.ts
} satisfies NextAuthConfig;
