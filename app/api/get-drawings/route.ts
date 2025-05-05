import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Initialize Supabase client with environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Check if environment variables are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "Database configuration error",
          data: [],
        },
        { status: 200 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch drawings
    const { data, error } = await supabase
      .from("drawings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching drawings:", error)

      // If the error is that the table doesn't exist, return a specific message
      if (error.message && error.message.includes("does not exist")) {
        return NextResponse.json({
          success: false,
          error: "The drawings table doesn't exist yet. Please create it using the SQL provided.",
          data: [],
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          data: [],
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("Error in GET drawings:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
      },
      { status: 200 },
    )
  }
}
