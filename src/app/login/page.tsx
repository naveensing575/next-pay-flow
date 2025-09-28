import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LandingPage from "@/components/LandingPage"
import GoogleOneTap from "@/components/auth/GoogleOneTap"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
  <>
    <GoogleOneTap/>
    <LandingPage />
  </>
  )
}
