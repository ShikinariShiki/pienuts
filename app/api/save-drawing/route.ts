import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const drawingData = formData.get("drawingData") as string
    const nickname = (formData.get("nickname") as string) || "Anonymous"
    const message = (formData.get("message") as string) || ""

    if (!drawingData) {
      return NextResponse.json({ error: "No drawing data provided" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json({ success: false, error: "Missing database configuration" })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to insert the drawing
    const { error } = await supabase.from("drawings").insert({
      drawing_data: drawingData,
      nickname,
      message,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error inserting drawing:", error)

      // If the error is that the table doesn't exist, return a specific message
      if (error.message && error.message.includes("does not exist")) {
        return NextResponse.json({
          success: false,
          error: "The drawings table doesn't exist. Please create it using the SQL provided.",
        })
      }

      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving drawing:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error saving drawing",
    })
  }
}
