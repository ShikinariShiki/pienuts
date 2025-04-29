import { type NextRequest, NextResponse } from "next/server"

// Simulate database with localStorage (in a real app, use a database)
const getStoredMessages = () => {
  // Default messages if none exist
  return [
    {
      id: 1,
      message: "Your art is so cute! I love your style so much! ♡",
      date: "2023-11-15",
      time_ago: "2 weeks ago",
    },
    {
      id: 2,
      message: "Can you teach me how to draw like you? I'm a big fan!",
      date: "2023-11-14",
      time_ago: "2 weeks ago",
    },
    {
      id: 3,
      message: "I saw your cosplay photos, they're amazing! What's your next costume?",
      date: "2023-11-12",
      time_ago: "3 weeks ago",
    },
    {
      id: 4,
      message: "Do you play Genshin Impact? What's your UID?",
      date: "2023-11-10",
      time_ago: "3 weeks ago",
    },
    {
      id: 5,
      message: "Your kawaii style is so inspiring! Keep up the great work!",
      date: "2023-11-08",
      time_ago: "3 weeks ago",
    },
  ]
}

// Format date to "time ago" format
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "today"
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return "1 week ago"
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return "1 month ago"
  return `${Math.floor(diffDays / 30)} months ago`
}

// GET handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    let messages = getStoredMessages()

    // Apply limit if specified
    if (limit && limit > 0) {
      messages = messages.slice(0, limit)
    }

    // Update time_ago for each message
    messages = messages.map((msg: any) => ({
      ...msg,
      time_ago: getTimeAgo(msg.date),
    }))

    return NextResponse.json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    })
  } catch (error) {
    console.error("Error retrieving messages:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve messages" }, { status: 500 })
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate message
    if (!data.message || data.message.trim() === "") {
      return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 })
    }

    // Create new message
    const newMsg = {
      id: Date.now(),
      message: data.message.trim(),
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
      time_ago: "just now",
    }

    // Get current messages
    let messages = getStoredMessages()

    // Add to messages
    messages = [newMsg, ...messages]

    // In a real app, you would save to a database here
    // For now, we'll just return the new message

    return NextResponse.json({ success: true, message: "Message added successfully", data: newMsg }, { status: 201 })
  } catch (error) {
    console.error("Error adding message:", error)
    return NextResponse.json({ success: false, message: "Failed to add message" }, { status: 500 })
  }
}
