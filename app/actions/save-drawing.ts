"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with server-side environment variables
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function saveDrawing(formData: FormData) {
  try {
    const drawingData = formData.get("drawingData") as string
    const nickname = (formData.get("nickname") as string) || "Anonymous"
    const message = (formData.get("message") as string) || ""

    if (!drawingData) {
      return { success: false, error: "No drawing data provided" }
    }

    // Insert the drawing into the Supabase table
    const { data, error } = await supabase
      .from("drawings")
      .insert([
        {
          drawing_data: drawingData,
          nickname,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error saving drawing:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in saveDrawing:", error)
    return { success: false, error: "Failed to save drawing" }
  }
}

export async function getDrawings(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("drawings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching drawings:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getDrawings:", error)
    return { success: false, error: "Failed to fetch drawings" }
  }
}
