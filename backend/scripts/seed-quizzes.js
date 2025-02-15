const API_URL = "http://localhost:8000/api";
const TOKEN = "";

const topics = [
  "Mathematics",
  "Science",
  "History",
  "Geography",
  "Literature",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Art",
];

const difficulties = ["Basic", "Intermediate", "Advanced"];

function generateQuizTitle() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const difficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];
  return `${topic} ${difficulty} Quiz`;
}

function generateQuizDescription() {
  const lines = [
    "Test your knowledge",
    "Challenge yourself",
    "Perfect for beginners",
    "Advanced concepts covered",
    "Comprehensive review",
    "Practice makes perfect",
    "Master the fundamentals",
    "Explore advanced topics",
    "Learn something new",
    "Boost your skills",
  ];
  const line = lines[Math.floor(Math.random() * lines.length)];
  return `${line} with this engaging quiz. Carefully crafted questions to help you learn and improve.`;
}

async function createQuiz() {
  try {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        title: generateQuizTitle(),
        description: generateQuizDescription(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Created quiz:", data);
    return data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    return null;
  }
}

async function seedQuizzes(count = 50) {
  console.log(`Starting to seed ${count} quizzes...`);

  for (let i = 0; i < count; i++) {
    console.log(`Creating quiz ${i + 1}/${count}...`);
    await createQuiz();
    // Add a small delay to prevent overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("Seeding completed!");
}

// Run the seeding
seedQuizzes(150);
