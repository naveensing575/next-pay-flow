import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Image from "next/image"
import LogoutButton from "@/components/auth/LogoutButton"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex items-center gap-4 p-4 border rounded-lg shadow-md max-w-md">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-lg font-semibold">{session.user?.name}</p>
          <p className="text-sm text-gray-600">{session.user?.email}</p>
          <p className="text-sm mt-1">
            Plan: <span className="font-medium">{session.user?.plan || "free"}</span>
          </p>
        </div>
      </div>

      <LogoutButton />
    </div>
  )
}
