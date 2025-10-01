import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Extend jsPDF type to include autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentId } = await req.json()

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("nextauth")

    // Get payment details
    const payment = await db.collection("subscriptions").findOne({
      _id: new ObjectId(paymentId),
      userId: new ObjectId(session.user.id),
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Get user details
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate PDF
    const pdf = new jsPDF() as jsPDFWithAutoTable

    // Add company logo/header
    pdf.setFontSize(24)
    pdf.setTextColor(37, 99, 235) // Blue color
    pdf.text("Next Pay Flow", 20, 20)

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text("Payment Receipt & Invoice", 20, 28)

    // Add horizontal line
    pdf.setDrawColor(200, 200, 200)
    pdf.line(20, 32, 190, 32)

    // Invoice details
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text("INVOICE", 20, 42)

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)

    const invoiceDate = new Date(payment.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    pdf.text(`Invoice Date: ${invoiceDate}`, 20, 50)
    pdf.text(`Invoice #: ${payment.orderId}`, 20, 56)
    pdf.text(`Payment ID: ${payment.paymentId || "N/A"}`, 20, 62)

    // Bill To section
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text("Bill To:", 20, 75)

    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(user.name || "User", 20, 82)
    pdf.text(user.email || "", 20, 88)

    // Table with payment details
    const amount = getAmountForPlan(payment.planId)
    const planName = getPlanName(payment.planId)

    autoTable(pdf, {
      startY: 100,
      head: [["Description", "Plan", "Amount", "Status"]],
      body: [
        [
          "Subscription Payment",
          planName,
          `₹${amount} INR`,
          payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
        ],
      ],
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
      },
    })

    // Total section
    const finalY = pdf.lastAutoTable?.finalY || 120
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text(`Total Amount: ₹${amount} INR`, 20, finalY + 15)

    // Footer
    pdf.setFontSize(9)
    pdf.setTextColor(100, 100, 100)
    pdf.text("Thank you for your business!", 20, finalY + 30)
    pdf.text(
      "For any queries, please contact us at support@nextpayflow.com",
      20,
      finalY + 36
    )

    // Add watermark/note
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text("This is a computer-generated invoice and requires no signature.", 20, 280)

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${payment.orderId}.pdf"`,
      },
    })
  } catch (err: unknown) {
    console.error("Error generating invoice:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// Helper functions
function getAmountForPlan(planId: string): number {
  const plans: Record<string, number> = {
    basic: 5,
    professional: 25,
    business: 45,
  }
  return plans[planId] || 0
}

function getPlanName(planId: string): string {
  const names: Record<string, string> = {
    basic: "Basic Plan",
    professional: "Professional Plan",
    business: "Business Plan",
  }
  return names[planId] || planId
}
