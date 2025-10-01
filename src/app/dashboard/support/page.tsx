"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { ArrowLeft, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/dashboard/layout/Navbar"
import Link from "next/link"
import { notify } from "@/components/notification"

export default function SupportPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    subject: "",
    message: "",
  })

  // Refs for custom validation
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Custom validation messages
    if (nameRef.current) {
      nameRef.current.setCustomValidity("")
      if (!formData.name.trim()) {
        nameRef.current.setCustomValidity("Please enter your name")
        nameRef.current.reportValidity()
        return
      }
    }

    if (emailRef.current) {
      emailRef.current.setCustomValidity("")
      if (!formData.email.trim()) {
        emailRef.current.setCustomValidity("Please enter your email address")
        emailRef.current.reportValidity()
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        emailRef.current.setCustomValidity("Please enter a valid email address")
        emailRef.current.reportValidity()
        return
      }
    }

    if (subjectRef.current) {
      subjectRef.current.setCustomValidity("")
      if (!formData.subject.trim()) {
        subjectRef.current.setCustomValidity("Please enter a subject for your message")
        subjectRef.current.reportValidity()
        return
      }
    }

    if (messageRef.current) {
      messageRef.current.setCustomValidity("")
      if (!formData.message.trim()) {
        messageRef.current.setCustomValidity("Please enter your message")
        messageRef.current.reportValidity()
        return
      }
    }

    setIsSending(true)
    try {
      const res = await fetch("/api/support/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        notify("success", "Message sent successfully! We'll get back to you soon.")
        setFormData({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          subject: "",
          message: ""
        })
      } else {
        notify("error", data.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      notify("error", "Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  if (status === "loading" || isLoggingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
      <Navbar
        session={session}
        onLogoutStart={() => setIsLoggingOut(true)}
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            variant="ghost"
            className="mb-6 hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <Card className="border-blue-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="space-y-3 pb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Contact Support</CardTitle>
              </div>
              <CardDescription className="text-base">
                Have a question or need help? Send us a message and we&apos;ll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>

            <Separator className="mb-6" />

            <CardContent className="space-y-6">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      ref={nameRef}
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (nameRef.current) {
                          nameRef.current.setCustomValidity("")
                        }
                      }}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      ref={emailRef}
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (emailRef.current) {
                          emailRef.current.setCustomValidity("")
                        }
                      }}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    ref={subjectRef}
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value })
                      if (subjectRef.current) {
                        subjectRef.current.setCustomValidity("")
                      }
                    }}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    ref={messageRef}
                    id="message"
                    placeholder="Tell us more about your question or issue..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (messageRef.current) {
                        messageRef.current.setCustomValidity("")
                      }
                    }}
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSending}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({
                      name: session?.user?.name || "",
                      email: session?.user?.email || "",
                      subject: "",
                      message: ""
                    })}
                    disabled={isSending}
                    className="h-11"
                  >
                    Clear
                  </Button>
                </div>
              </form>

              <Separator />

              {/* Alternative Contact */}
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Need immediate assistance?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href="mailto:naveensing575@gmail.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Email us directly
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}