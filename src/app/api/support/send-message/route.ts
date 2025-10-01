import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const userPlan = session.user.plan || "free"

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "naveensing575@gmail.com",
      replyTo: email,
      subject: `Support: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Support Message</h1>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 30px; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">From:</p>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">
                ${name}
                <span style="font-weight: normal; color: #6b7280;">&lt;${email}&gt;</span>
              </p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px;">
                Plan: <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; text-transform: capitalize;">${userPlan}</span>
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Subject:</p>
              <p style="margin: 0; font-size: 16px; font-weight: 500; color: #111827;">${subject}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Message:</p>
              <div style="color: #374151; line-height: 1.6; white-space: pre-wrap; font-size: 15px; background: #f9fafb; padding: 15px; border-radius: 6px;">${message}</div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Reply to this email to respond directly to ${name}
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Support request sent successfully",
    })
  } catch (err: unknown) {
    console.error("Error sending support email:", err)
    return NextResponse.json(
      { error: "Failed to send support request" },
      { status: 500 }
    )
  }
}