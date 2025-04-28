// This is a mock API service that simulates AJAX requests
// In a real application, these would be actual API calls to a backend server

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Simulate server storage
let serverMessages = [
  {
    id: 1,
    message: "Your art is so cute! I love your style so much! ♡",
    date: "2023-11-15",
  },
  {
    id: 2,
    message: "Can you teach me how to draw like you? I'm a big fan!",
    date: "2023-11-14",
  },
  {
    id: 3,
    message: "I saw your cosplay photos, they're amazing! What's your next costume?",
    date: "2023-11-12",
  },
  {
    id: 4,
    message: "Do you play Genshin Impact? What's your UID?",
    date: "2023-11-10",
  },
  {
    id: 5,
    message: "Your kawaii style is so inspiring! Keep up the great work!",
    date: "2023-11-08",
  },
]

export async function fetchUserData() {
  // Simulate API request
  await delay(800)

  // Return mock data
  return {
    name: "PIEN",
    age: 19,
    tags: ["Artist", "Gamer", "Otaku", "Music Lover", "Foodie"],
    profileImage: "/images/profile.png",
  }
}

export async function fetchUserProfile() {
  // Simulate API request
  await delay(1000)

  // Return mock data
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
  // Simulate API request
  await delay(700)

  // Return mock data
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
  // Simulate API request
  await delay(600)

  // Return mock data
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
  // Simulate API request
  await delay(900)

  // Return mock data
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

export async function fetchRecentMessages() {
  // Simulate API request
  await delay(800)

  // Return mock data from server
  return serverMessages.slice(0, 3)
}

export async function fetchAllMessages() {
  // Simulate API request
  await delay(800)

  // Return all messages from server
  return serverMessages
}

export async function sendUserMessage(message: string) {
  // Simulate API request
  await delay(1000)

  // Create new message
  const newMsg = {
    id: Date.now(),
    message: message,
    date: new Date().toLocaleDateString(),
  }

  // Add to server storage (in a real app, this would be a database operation)
  serverMessages = [newMsg, ...serverMessages]

  // Return success response
  return { success: true }
}
