import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    console.log("[v0] Generating recipe with prompt:", prompt.substring(0, 100) + "...")

    const recipe = await generateProfessionalRecipe(prompt)

    console.log("[v0] Generated professional recipe:", recipe.title)
    return Response.json({ recipe })
  } catch (error) {
    console.error("[v0] Error generating recipe:", error)
    return Response.json({ error: "Failed to generate recipe" }, { status: 500 })
  }
}

async function generateProfessionalRecipe(userPrompt: string): Promise<any> {
  const professionalPrompt = `You are a professional chef and recipe developer. Create a complete recipe based on the following user request:

User request: "${userPrompt}"

Your recipe must be:
1. Accurate, realistic, and possible to cook at home.
2. Adapted to the user's preferences (dietary restrictions, cuisine style, cooking method, difficulty).
3. Structured clearly in this format:
   - Title (with a short, engaging style, optionally with an emoji)
   - Cuisine Type
   - Difficulty Level (Beginner, Intermediate, Advanced)
   - Cooking Method
   - Cooking Time (realistic minutes, not random)
   - Servings
   - Dietary Info (e.g., vegetarian, vegan, gluten-free, halal, kosher)
   - Ingredients (exact quantities with units)
   - Step-by-Step Instructions
   - Helpful Cooking Tips

Constraints:
- Avoid unrealistic combinations (e.g., baking raw lettuce).
- Respect dietary restrictions (no animal products for vegan, no gluten for gluten-free, etc.).
- Ensure ingredients and steps align with the chosen cuisine.
- Keep instructions beginner-friendly if the request suggests "easy" or "quick".

Final Output:
Return the recipe strictly in JSON with these keys:
{
  "title": "...",
  "cuisine": "...",
  "difficulty": "...",
  "method": "...",
  "cookingTime": "...",
  "servings": "...",
  "dietaryInfo": [...],
  "ingredients": [...],
  "steps": [...],
  "tips": [...]
}`

  return simulateChefResponse(userPrompt, professionalPrompt)
}

function simulateChefResponse(userPrompt: string, professionalPrompt: string): any {
  const analysis = analyzeUserRequest(userPrompt)

  return {
    title: generateProfessionalTitle(analysis),
    cuisine: analysis.cuisine,
    difficulty: analysis.difficulty,
    method: analysis.method,
    cookingTime: analysis.cookingTime,
    servings: analysis.servings,
    dietaryInfo: analysis.dietaryInfo,
    ingredients: generateRealisticIngredients(analysis),
    steps: generateProfessionalSteps(analysis),
    tips: generateExpertTips(analysis),
  }
}

function analyzeUserRequest(prompt: string): any {
  const lower = prompt.toLowerCase()

  // Detect main ingredients
  const proteins = ["chicken", "beef", "pork", "fish", "salmon", "shrimp", "tofu", "eggs"]
  const vegetables = ["broccoli", "spinach", "mushroom", "carrot", "pepper", "onion", "tomato"]
  const grains = ["rice", "pasta", "noodles", "quinoa", "bread"]

  const foundProteins = proteins.filter((p) => lower.includes(p))
  const foundVegetables = vegetables.filter((v) => lower.includes(v))
  const foundGrains = grains.filter((g) => lower.includes(g))

  // Determine cuisine
  let cuisine = "International"
  if (lower.includes("italian") || lower.includes("pasta") || lower.includes("pizza")) cuisine = "Italian"
  else if (lower.includes("asian") || lower.includes("chinese") || lower.includes("stir fry")) cuisine = "Asian"
  else if (lower.includes("mexican") || lower.includes("taco") || lower.includes("burrito")) cuisine = "Mexican"
  else if (lower.includes("indian") || lower.includes("curry")) cuisine = "Indian"
  else if (lower.includes("mediterranean") || lower.includes("greek")) cuisine = "Mediterranean"
  else if (lower.includes("french")) cuisine = "French"

  // Determine difficulty and method
  const isQuick = lower.includes("quick") || lower.includes("easy") || lower.includes("simple")
  const difficulty = isQuick ? "Beginner" : lower.includes("advanced") ? "Advanced" : "Intermediate"

  // Cooking method
  let method = "Sauté"
  if (lower.includes("bake") || lower.includes("oven")) method = "Baking"
  else if (lower.includes("grill")) method = "Grilling"
  else if (lower.includes("stir fry") || lower.includes("wok")) method = "Stir-frying"
  else if (lower.includes("steam")) method = "Steaming"
  else if (lower.includes("roast")) method = "Roasting"

  let cookingTime = "25-30 minutes" // default

  // Look for specific time mentions in the prompt
  const timePatterns = [
    /(\d+)\s*minutes?/i,
    /less than (\d+)\s*minutes?/i,
    /under (\d+)\s*minutes?/i,
    /within (\d+)\s*minutes?/i,
    /about (\d+)\s*minutes?/i,
    /around (\d+)\s*minutes?/i,
  ]

  for (const pattern of timePatterns) {
    const match = prompt.match(pattern)
    if (match) {
      const requestedTime = Number.parseInt(match[1])
      if (requestedTime <= 15) {
        cookingTime = `${Math.max(10, requestedTime - 2)}-${requestedTime} minutes`
      } else if (requestedTime <= 30) {
        cookingTime = `${Math.max(15, requestedTime - 5)}-${requestedTime} minutes`
      } else if (requestedTime <= 60) {
        cookingTime = `${Math.max(30, requestedTime - 10)}-${requestedTime} minutes`
      } else {
        cookingTime = `${requestedTime - 15}-${requestedTime} minutes`
      }
      break
    }
  }

  // If no specific time found, use difficulty-based defaults
  if (!timePatterns.some((pattern) => prompt.match(pattern))) {
    if (isQuick) {
      cookingTime = "15-20 minutes"
    } else if (difficulty === "Advanced") {
      cookingTime = "45-60 minutes"
    } else {
      cookingTime = "25-35 minutes"
    }
  }

  // Dietary restrictions
  const dietaryInfo = []
  if (lower.includes("vegetarian")) dietaryInfo.push("Vegetarian")
  if (lower.includes("vegan")) dietaryInfo.push("Vegan")
  if (lower.includes("gluten-free")) dietaryInfo.push("Gluten-free")
  if (lower.includes("dairy-free")) dietaryInfo.push("Dairy-free")
  if (lower.includes("keto")) dietaryInfo.push("Keto-friendly")
  if (lower.includes("healthy") || lower.includes("light")) dietaryInfo.push("Healthy")

  return {
    mainIngredients: [...foundProteins, ...foundVegetables, ...foundGrains],
    cuisine,
    difficulty,
    method,
    cookingTime,
    servings: "4 servings",
    dietaryInfo,
    isQuick,
    isVegetarian: dietaryInfo.includes("Vegetarian") || dietaryInfo.includes("Vegan"),
    originalPrompt: prompt,
  }
}

function generateProfessionalTitle(analysis: any): string {
  const { mainIngredients, cuisine, isQuick } = analysis
  const mainIngredient = mainIngredients[0] || "Surprise"

  const adjectives = isQuick ? ["Quick", "Easy", "Simple"] : ["Gourmet", "Classic", "Artisan"]
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]

  const emoji = getEmoji(cuisine, mainIngredient)
  const capitalizedIngredient = mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)

  if (cuisine !== "International") {
    return `${emoji} ${cuisine} ${capitalizedIngredient} ${analysis.method === "Stir-frying" ? "Stir-fry" : "Dish"}`
  }

  return `${emoji} ${adj} ${capitalizedIngredient} ${analysis.method === "Baking" ? "Bake" : "Sauté"}`
}

function generateRealisticIngredients(analysis: any): string[] {
  const ingredients = []
  const { mainIngredients, cuisine, isVegetarian, method } = analysis

  // Main protein or base
  if (mainIngredients.includes("chicken") && !isVegetarian) {
    ingredients.push("1 lb (450g) chicken breast, cut into bite-sized pieces")
  } else if (mainIngredients.includes("beef") && !isVegetarian) {
    ingredients.push("1 lb (450g) beef sirloin, sliced thin")
  } else if (mainIngredients.includes("tofu") || isVegetarian) {
    ingredients.push("14 oz (400g) firm tofu, cubed")
  }

  // Vegetables
  if (mainIngredients.includes("broccoli")) ingredients.push("2 cups fresh broccoli florets")
  if (mainIngredients.includes("mushroom")) ingredients.push("8 oz (225g) mushrooms, sliced")
  if (mainIngredients.includes("pepper")) ingredients.push("1 large bell pepper, sliced")

  // Always add aromatics
  ingredients.push("3 cloves garlic, minced")
  ingredients.push("1 medium onion, diced")

  // Cooking fat
  if (cuisine === "Asian") {
    ingredients.push("2 tbsp vegetable oil")
    ingredients.push("1 tbsp sesame oil")
  } else {
    ingredients.push("2 tbsp olive oil")
  }

  // Seasonings based on cuisine
  if (cuisine === "Asian") {
    ingredients.push("3 tbsp soy sauce")
    ingredients.push("1 tbsp rice vinegar")
    ingredients.push("1 tsp fresh ginger, grated")
  } else if (cuisine === "Italian") {
    ingredients.push("1 tsp dried oregano")
    ingredients.push("1/2 cup grated Parmesan cheese")
    ingredients.push("2 tbsp fresh basil, chopped")
  } else if (cuisine === "Mexican") {
    ingredients.push("1 tsp ground cumin")
    ingredients.push("1 tsp paprika")
    ingredients.push("Juice of 1 lime")
  }

  // Base seasonings
  ingredients.push("Salt and black pepper to taste")

  return ingredients
}

function generateProfessionalSteps(analysis: any): string[] {
  const { method, cuisine, mainIngredients, isQuick } = analysis
  const steps = []

  // Prep step (professional standard)
  steps.push("Prepare all ingredients by washing, chopping, and measuring before you begin cooking (mise en place).")

  if (method === "Stir-frying" || method === "Sauté") {
    steps.push("Heat oil in a large skillet or wok over medium-high heat until shimmering.")
    steps.push("Add aromatics (garlic and onion) and cook for 30-60 seconds until fragrant.")

    if (mainIngredients.some((i) => ["chicken", "beef", "pork"].includes(i))) {
      steps.push("Add protein and cook for 4-6 minutes until golden brown and cooked through. Remove and set aside.")
      steps.push("Add vegetables to the same pan and stir-fry for 3-4 minutes until tender-crisp.")
      steps.push("Return protein to pan, add seasonings and sauces, toss everything together for 1-2 minutes.")
    } else {
      steps.push("Add vegetables and cook for 4-5 minutes until tender-crisp.")
      steps.push("Add seasonings and sauces, toss to combine and cook for another 1-2 minutes.")
    }
  } else if (method === "Baking") {
    steps.push("Preheat oven to 400°F (200°C).")
    steps.push("Toss all ingredients with oil and seasonings in a large baking dish.")
    steps.push("Bake for 25-30 minutes, stirring once halfway through, until ingredients are tender and golden.")
  } else if (method === "Roasting") {
    steps.push("Preheat oven to 425°F (220°C).")
    steps.push("Arrange ingredients on a large baking sheet, drizzle with oil and seasonings.")
    steps.push("Roast for 20-25 minutes until caramelized and cooked through.")
  }

  steps.push("Taste and adjust seasoning with salt and pepper as needed.")
  steps.push("Serve immediately while hot, garnished with fresh herbs if desired.")

  return steps
}

function generateExpertTips(analysis: any): string[] {
  const { method, cuisine, difficulty, isQuick } = analysis
  const tips = []

  // Method-specific tips
  if (method === "Stir-frying") {
    tips.push(
      'Keep the heat high and ingredients moving to achieve the characteristic "wok hei" (breath of the wok) flavor.',
    )
    tips.push("Cut all ingredients to similar sizes for even cooking.")
  } else if (method === "Baking") {
    tips.push("Avoid overcrowding the baking dish - ingredients should be in a single layer for proper browning.")
  }

  // Cuisine-specific tips
  if (cuisine === "Asian") {
    tips.push("Add soy sauce at the end to prevent it from burning and becoming bitter.")
  } else if (cuisine === "Italian") {
    tips.push("Save some pasta water if using pasta - the starch helps bind sauces.")
  }

  // Universal professional tips
  tips.push("Let the dish rest for 2-3 minutes after cooking to allow flavors to meld together.")

  if (difficulty === "Beginner") {
    tips.push("Prep all ingredients before you start cooking - this makes the process much smoother.")
  }

  return tips.slice(0, 3)
}

function getEmoji(cuisine: string, ingredient: string): string {
  const emojiMap = {
    Asian: ["🥢", "🍜", "🥟"][Math.floor(Math.random() * 3)],
    Italian: ["🍝", "🍕", "🧄"][Math.floor(Math.random() * 3)],
    Mexican: ["🌮", "🌶️", "🥑"][Math.floor(Math.random() * 3)],
    Indian: ["🍛", "🌶️", "🥘"][Math.floor(Math.random() * 3)],
    Mediterranean: ["🫒", "🍅", "🧄"][Math.floor(Math.random() * 3)],
    French: ["🥖", "🧄", "🍷"][Math.floor(Math.random() * 3)],
  }

  return emojiMap[cuisine] || ["🍽️", "👨‍🍳", "✨"][Math.floor(Math.random() * 3)]
}
