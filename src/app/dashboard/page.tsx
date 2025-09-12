import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    // Safe redirect, Next.js types are happy
    redirect("/api/auth/signin")
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome {session.user?.name}</p>
    </div>
  )
}
