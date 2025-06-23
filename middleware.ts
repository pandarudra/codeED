import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // This runs **only** if `authorized` returns true
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" }, // redirect unauthenticated users here
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;

        // Allow unprotected paths
        if (path.startsWith("/api/auth") || path === "/login" || path === "/") {
          return true;
        }

        // Protect all other paths: require a valid session token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
