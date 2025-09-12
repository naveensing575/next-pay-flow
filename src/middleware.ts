// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Return true to allow access if the token exists
      return !!token;
    },
  },
  // You can set the signIn page here if you want to use the default behavior
  // This will handle the redirect automatically.
  // The pages.signIn option in your authOptions is not needed if you use this.
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Protect the dashboard and any sub-routes
};