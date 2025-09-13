import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Dashboard from "@/components/dashboard/Dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Debug log to check session structure
  console.log('Session data:', JSON.stringify(session, null, 2))

  if (!session || !session.user) {
    redirect("/login")
  }

  return <Dashboard session={session} />
}