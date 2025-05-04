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
          data: getSampleDrawings(), // Return sample drawings as fallback
        },
        { status: 200 }, // Return 200 with sample data
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to create the table if it doesn't exist
    try {
      await supabase.rpc("create_drawings_table_if_not_exists")
    } catch (error) {
      console.error("Error creating table:", error)
      // Continue anyway, we'll handle errors below
    }

    // Fetch drawings with a timeout
    const fetchPromise = supabase.from("drawings").select("*").order("created_at", { ascending: false }).limit(50)

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database request timed out")), 5000)
    })

    // Race between fetch and timeout
    const { data, error } = (await Promise.race([
      fetchPromise,
      timeoutPromise.then(() => {
        throw new Error("Timeout")
      }),
    ])) as any

    if (error) {
      console.error("Error fetching drawings:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          data: getSampleDrawings(), // Return sample drawings as fallback
        },
        { status: 200 }, // Return 200 with sample data
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
        data: getSampleDrawings(), // Return sample drawings as fallback
      },
      { status: 200 }, // Return 200 with sample data
    )
  }
}

// Sample drawings for fallback
function getSampleDrawings() {
  return [
    {
      id: "1",
      drawing_data: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/sample-drawing1-Yx9Ij9Yx9Ij9Yx9Ij9.png",
      nickname: "sayang1",
      message: "Welcome to the secret gallery!",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      drawing_data: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/sample-drawing2-Yx9Ij9Yx9Ij9Yx9Ij9.png",
      nickname: "sayang2",
      message: "Drawing is fun!",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "3",
      drawing_data: "https://xri1xbwynlfpuw7m.public.blob.vercel-storage.com/sample-drawing3-Yx9Ij9Yx9Ij9Yx9Ij9.png",
      nickname: "sayang3",
      message: "I love drawing!",
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ]
}
