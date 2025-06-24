import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Runs only when authorized() returns true
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;

        //  Allow public pages
        const publicPaths = ["/", "/login"];
        const isPublic =
          publicPaths.includes(path) || path.startsWith("/api/auth");

        if (isPublic) return true;

        //  Protect everything else
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/dashboard/:path*",
  ],
};
