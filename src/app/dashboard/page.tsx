import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LogoutButton from "@/components/auth/LogoutButton"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={64}
                height={64}
                className="rounded-full border"
              />
            )}
            <div>
              <p className="font-medium">{session.user?.name}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
              <p className="text-sm mt-1">
                Plan:{" "}
                <span className="font-medium text-green-600">
                  {session.user?.plan || "free"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <LogoutButton />
            <Button className="flex-1">Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
