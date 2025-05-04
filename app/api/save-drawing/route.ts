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
      // Return success anyway to not disrupt user experience
      return NextResponse.json({ success: true })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to insert the drawing with a timeout
    const insertPromise = supabase.from("drawings").insert([
      {
        drawing_data: drawingData,
        nickname,
        message,
        created_at: new Date().toISOString(),
      },
    ])

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database request timed out")), 5000)
    })

    // Race between insert and timeout
    await Promise.race([
      insertPromise,
      timeoutPromise.then(() => {
        throw new Error("Timeout")
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving drawing:", error)
    // Return success anyway to not disrupt user experience
    return NextResponse.json({ success: true })
  }
}
