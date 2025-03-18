import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // In a real application, you would fetch this from your database or external API
    // For now, we'll read from a local file
    const filePath = path.join(process.cwd(), "data", "TikTok.csv")
    const csvContent = fs.readFileSync(filePath, "utf-8")
    
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
      },
    })
  } catch (error) {
    console.error("Error reading CSV file:", error)
    return new NextResponse("Error fetching videos", { status: 500 })
  }
}