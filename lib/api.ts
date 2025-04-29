// This is a mock API service that simulates AJAX requests
// In a real application, these would be actual API calls to a backend server

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

// Get messages from server or localStorage fallback
export async function fetchAllMessages() {
  try {
    // Try to fetch from server first
    const response = await apiRequest("messages")
    return response.data || []
  } catch (error) {
    console.warn("Falling back to localStorage for messages:", error)

    // Fallback to localStorage if server request fails
    if (isBrowser) {
      try {
        const storedMessages = localStorage.getItem("server_messages")
        if (storedMessages) {
          return JSON.parse(storedMessages)
        }
      } catch (localError) {
        console.error("Error retrieving messages from localStorage:", localError)
      }
    }

    // Default messages if both server and localStorage fail
    return getDefaultMessages()
  }
}

// Get recent messages (limited number)
export async function fetchRecentMessages(limit = 3) {
  try {
    // Try to fetch from server first with limit parameter
    const response = await apiRequest(`messages?limit=${limit}`)
    return response.data || []
  } catch (error) {
    console.warn("Falling back to localStorage for recent messages:", error)

    // Fallback to localStorage
    if (isBrowser) {
      try {
        const storedMessages = localStorage.getItem("server_messages")
        if (storedMessages) {
          const messages = JSON.parse(storedMessages)
          return messages.slice(0, limit)
        }
      } catch (localError) {
        console.error("Error retrieving messages from localStorage:", localError)
      }
    }

    // Default messages if both server and localStorage fail
    return getDefaultMessages().slice(0, limit)
  }
}

// Send a new message
export async function sendUserMessage(message: string) {
  try {
    // Try to send to server first
    const response = await apiRequest("messages", {
      method: "POST",
      body: JSON.stringify({ message }),
    })

    // If successful, return the server response
    return response
  } catch (error) {
    console.warn("Falling back to localStorage for sending message:", error)

    // Fallback to localStorage
    if (isBrowser) {
      try {
        // Create new message
        const newMsg = {
          id: Date.now(),
          message: message,
          date: new Date().toLocaleDateString(),
          time_ago: "just now",
        }

        // Get current messages
        let messages = []
        const storedMessages = localStorage.getItem("server_messages")

        if (storedMessages) {
          messages = JSON.parse(storedMessages)
        } else {
          messages = getDefaultMessages()
        }

        // Add to messages
        messages = [newMsg, ...messages]

        // Save back to localStorage
        localStorage.setItem("server_messages", JSON.stringify(messages))

        // Return success response
        return { success: true, data: newMsg }
      } catch (localError) {
        console.error("Error saving message to localStorage:", localError)
        throw localError
      }
    }

    // If we're not in a browser or localStorage fails, re-throw the original error
    throw error
  }
}

// Delete a message
export async function deleteUserMessage(messageId: number) {
  try {
    // Try to delete from server first
    const response = await apiRequest("messages", {
      method: "DELETE",
      body: JSON.stringify({ id: messageId }),
    })

    // If successful, return the server response
    return response
  } catch (error) {
    console.warn("Falling back to localStorage for deleting message:", error)

    // Fallback to localStorage
    if (isBrowser) {
      try {
        // Get current messages
        const storedMessages = localStorage.getItem("server_messages")

        if (storedMessages) {
          let messages = JSON.parse(storedMessages)

          // Filter out the message to delete
          messages = messages.filter((msg: any) => msg.id !== messageId)

          // Save back to localStorage
          localStorage.setItem("server_messages", JSON.stringify(messages))

          // Return success response
          return { success: true }
        }
      } catch (localError) {
        console.error("Error deleting message from localStorage:", localError)
        throw localError
      }
    }

    // If we're not in a browser or localStorage fails, re-throw the original error
    throw error
  }
}

// Default messages if no stored messages exist
function getDefaultMessages() {
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

// Other API functions remain the same
export async function fetchUserData() {
  await delay(800)
  return {
    name: "PIEN",
    age: 19,
    tags: ["Artist", "Gamer", "Otaku", "Music Lover", "Foodie"],
    profileImage: "/images/profile.png",
  }
}

export async function fetchUserProfile() {
  await delay(1000)
  return {
    name: "PIEN",
    age: 19,
    bio: "Digital artist, gamer, and anime enthusiast. I love creating cute illustrations and playing games!",
    likes:
      "I love playing HSR, drawing cute characters, listening to music, and eating sweets! My favorite color is pastel pink and I adore kawaii aesthetics.",
    dislikes:
      "I don't like spicy food, horror movies, rainy days when I have to go out, and when my internet is slow while gaming.",
    other:
      "I'm a digital artist who loves to create cute illustrations. My dream is to publish my own manga one day! I also enjoy collecting stationery and plushies.",
    profileImage: "/images/profile.png",
    tags: ["Artist", "Gamer", "Otaku", "Music Lover", "Foodie"],
  }
}

export async function fetchDniData() {
  await delay(700)
  return {
    title: "Do Not Interact",
    items: [
      "Minor",
      "02 voter",
      "Homophobic",
      "Kalah 50/50 10",
      "Lorem ipsum dolor vincit amet tribie lucu bukan main",
    ],
    note: "This is just for my personal boundaries. If you respect these boundaries, we can be friends! (◕‿◕✿)",
  }
}

export async function fetchByfData() {
  await delay(600)
  return {
    title: "Before You Follow",
    items: [
      "Minor",
      "02 voter",
      "Homophobic",
      "Kalah 50/50 10",
      "Lorem ipsum dolor vincit amet tribie lucu bukan main",
    ],
    note: "I post content about anime, games, and my art. If you're comfortable with that, feel free to follow! (◕‿◕✿)",
  }
}

export async function fetchFavsData() {
  await delay(900)
  return {
    categories: [
      {
        name: "Games",
        icon: "🎮",
        items: ["Genshin Impact", "Honkai Star Rail", "Tears of the Kingdom", "Stardew Valley"],
      },
      {
        name: "Music",
        icon: "🎵",
        items: ["K-pop", "J-pop", "Lofi", "Game Soundtracks"],
      },
      {
        name: "Anime",
        icon: "🎬",
        items: ["Jujutsu Kaisen", "Spy x Family", "Fruits Basket", "My Hero Academia"],
      },
      {
        name: "Food",
        icon: "🍦",
        items: ["Matcha", "Bubble Tea", "Strawberry Cake", "Ice Cream"],
      },
    ],
  }
}
