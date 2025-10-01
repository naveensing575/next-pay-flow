export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/api/payments/:path*"]
}