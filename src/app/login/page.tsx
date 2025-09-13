"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-4">
      <Card className="w-full max-w-md shadow-lg border border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-sm text-muted-foreground text-center">
            Sign in to continue to your dashboard
          </p>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full h-11 font-medium bg-foreground text-background hover:opacity-90"
          >
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
              fill="currentColor"
            >
              <path d="M488 261.8c0-17.8-1.6-35-4.7-51.7H249v97.9h135.7c-5.9 31.8-23.7 58.8-50.4 76.8l81.4 63.5c47.6-44 72.3-108.7 72.3-186.5z" />
              <path d="M249 492c66.8 0 122.6-22 163.5-59.6l-81.4-63.5c-22.7 15.3-51.5 24.5-82.1 24.5-63 0-116.3-42.5-135.2-99.7l-83.2 64.3C69.7 437.3 151.8 492 249 492z" />
              <path d="M113.8 294.7c-6-17.8-9.4-36.8-9.4-56.7s3.4-38.9 9.4-56.7l-83.2-64.3C15.2 147.5 0 196.4 0 248c0 51.6 15.2 100.5 41.7 141.1l72.1-55.1z" />
              <path d="M249 97.7c36.4 0 69.1 12.5 94.9 37.1l71.2-71.2C371.5 23.2 315.8 0 249 0 151.8 0 69.7 54.7 29.7 134.9l83.2 64.3c18.9-57.2 72.2-99.7 136.1-99.7z" />
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
