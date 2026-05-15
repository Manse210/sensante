import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/patients/:path*",
    "/consultations/:path*",
    "/dashboard/:path*",
    "/profil/:path*",
    "/ia/:path*",
    "/api/patients/:path*",
    "/api/consultations/:path*",
  ],
};
