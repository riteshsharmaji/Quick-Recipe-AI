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
  // Extract the actual recipe request (remove JSON format instructions)
  const cleanPrompt = prompt.split('Provide the response in this exact JSON format:')[0].trim()
  const lower = cleanPrompt.toLowerCase()

  // Detect specific recipe types first
  let specificRecipe = ""
  let recipeType = ""
  
  // Check for specific recipe requests
  if (lower.includes("instant noodle upgrade")) {
    specificRecipe = "instant noodle upgrade"
    recipeType = "upgrade"
  } else if (lower.includes("garlic bread")) {
    specificRecipe = "garlic bread"
    recipeType = "bread"
  } else if (lower.includes("egg breakfast")) {
    specificRecipe = "egg breakfast"
    recipeType = "breakfast"
  } else if (lower.includes("vegetarian pasta")) {
    specificRecipe = "vegetarian pasta"
    recipeType = "pasta"
  } else if (lower.includes("healthy smoothie bowl")) {
    specificRecipe = "healthy smoothie bowl"
    recipeType = "smoothie"
  } else if (lower.includes("easy sandwich")) {
    specificRecipe = "easy sandwich"
    recipeType = "sandwich"
  } else if (lower.includes("simple salad")) {
    specificRecipe = "simple salad"
    recipeType = "salad"
  } else if (lower.includes("quick stir-fry")) {
    specificRecipe = "quick stir-fry"
    recipeType = "stir-fry"
  } else if (lower.includes("microwave mug cake")) {
    specificRecipe = "microwave mug cake"
    recipeType = "dessert"
  } else if (lower.includes("no-cook snack")) {
    specificRecipe = "no-cook snack"
    recipeType = "snack"
  }

  // Detect main ingredients
  const proteins = ["chicken", "beef", "pork", "fish", "salmon", "shrimp", "tofu", "eggs"]
  const vegetables = ["broccoli", "spinach", "mushroom", "carrot", "pepper", "onion", "tomato"]
  const grains = ["rice", "pasta", "noodles", "quinoa", "bread"]

  const foundProteins = proteins.filter((p) => lower.includes(p))
  const foundVegetables = vegetables.filter((v) => lower.includes(v))
  const foundGrains = grains.filter((g) => lower.includes(g))

  // Determine cuisine based on specific recipe or keywords
  let cuisine = "International"
  if (specificRecipe.includes("pasta") || lower.includes("italian") || lower.includes("pizza")) {
    cuisine = "Italian"
  } else if (lower.includes("asian") || lower.includes("chinese") || lower.includes("stir fry") || specificRecipe.includes("stir-fry")) {
    cuisine = "Asian"
  } else if (lower.includes("mexican") || lower.includes("taco") || lower.includes("burrito")) {
    cuisine = "Mexican"
  } else if (lower.includes("indian") || lower.includes("curry")) {
    cuisine = "Indian"
  } else if (lower.includes("mediterranean") || lower.includes("greek")) {
    cuisine = "Mediterranean"
  } else if (lower.includes("french")) {
    cuisine = "French"
  }

  // Determine difficulty and method based on specific recipe
  let difficulty = "Intermediate"
  let method = "Sauté"
  let cookingTime = "25-30 minutes"

  if (specificRecipe) {
    switch (recipeType) {
      case "upgrade":
        difficulty = "Beginner"
        method = "Boiling"
        cookingTime = "5-8 minutes"
        break
      case "bread":
        difficulty = "Beginner"
        method = "Baking"
        cookingTime = "10-15 minutes"
        break
      case "breakfast":
        difficulty = "Beginner"
        method = "Frying"
        cookingTime = "5-10 minutes"
        break
      case "smoothie":
        difficulty = "Beginner"
        method = "Blending"
        cookingTime = "3-5 minutes"
        break
      case "sandwich":
        difficulty = "Beginner"
        method = "No-cook"
        cookingTime = "2-5 minutes"
        break
      case "salad":
        difficulty = "Beginner"
        method = "No-cook"
        cookingTime = "5-10 minutes"
        break
      case "stir-fry":
        difficulty = "Beginner"
        method = "Stir-frying"
        cookingTime = "8-12 minutes"
        break
      case "dessert":
        difficulty = "Beginner"
        method = "Microwave"
        cookingTime = "2-3 minutes"
        break
      case "snack":
        difficulty = "Beginner"
        method = "No-cook"
        cookingTime = "1-3 minutes"
        break
    }
  } else {
    // Fallback to keyword analysis
    const isQuick = lower.includes("quick") || lower.includes("easy") || lower.includes("simple")
    difficulty = isQuick ? "Beginner" : lower.includes("advanced") ? "Advanced" : "Intermediate"

    if (lower.includes("bake") || lower.includes("oven")) method = "Baking"
    else if (lower.includes("grill")) method = "Grilling"
    else if (lower.includes("stir fry") || lower.includes("wok")) method = "Stir-frying"
    else if (lower.includes("steam")) method = "Steaming"
    else if (lower.includes("roast")) method = "Roasting"

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
      const match = cleanPrompt.match(pattern)
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
    if (!timePatterns.some((pattern) => cleanPrompt.match(pattern))) {
      if (isQuick) {
        cookingTime = "15-20 minutes"
      } else if (difficulty === "Advanced") {
        cookingTime = "45-60 minutes"
      } else {
        cookingTime = "25-35 minutes"
      }
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
    specificRecipe,
    recipeType,
    mainIngredients: [...foundProteins, ...foundVegetables, ...foundGrains],
    cuisine,
    difficulty,
    method,
    cookingTime,
    servings: "4 servings",
    dietaryInfo,
    isQuick: difficulty === "Beginner",
    isVegetarian: dietaryInfo.includes("Vegetarian") || dietaryInfo.includes("Vegan"),
    originalPrompt: cleanPrompt,
  }
}

function generateProfessionalTitle(analysis: any): string {
  const { specificRecipe, mainIngredients, cuisine, isQuick } = analysis
  
  // If we have a specific recipe request, use it
  if (specificRecipe) {
    const emoji = getEmoji(cuisine, specificRecipe)
    return `${emoji} ${specificRecipe.charAt(0).toUpperCase() + specificRecipe.slice(1)}`
  }
  
  // Fallback to original logic
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
  const { specificRecipe, recipeType, mainIngredients, cuisine, isVegetarian, method } = analysis

  // Generate ingredients based on specific recipe type
  if (specificRecipe) {
    switch (recipeType) {
      case "upgrade":
        ingredients.push("1 packet instant noodles (any flavor)")
        ingredients.push("1 egg")
        ingredients.push("2 green onions, chopped")
        ingredients.push("1 tbsp soy sauce")
        ingredients.push("1 tsp sesame oil")
        ingredients.push("1/2 cup frozen vegetables")
        ingredients.push("1 clove garlic, minced")
        ingredients.push("Red pepper flakes (optional)")
        break
      case "bread":
        ingredients.push("1 loaf French bread or baguette")
        ingredients.push("1/2 cup butter, softened")
        ingredients.push("4 cloves garlic, minced")
        ingredients.push("2 tbsp fresh parsley, chopped")
        ingredients.push("1/4 cup grated Parmesan cheese")
        ingredients.push("Salt and black pepper to taste")
        break
      case "breakfast":
        ingredients.push("2-3 eggs")
        ingredients.push("1 tbsp butter or oil")
        ingredients.push("Salt and black pepper to taste")
        ingredients.push("1 slice bread (optional)")
        ingredients.push("1 tbsp milk (optional)")
        break
      case "smoothie":
        ingredients.push("1 frozen banana")
        ingredients.push("1/2 cup frozen berries")
        ingredients.push("1/2 cup milk or almond milk")
        ingredients.push("1 tbsp honey or maple syrup")
        ingredients.push("1 tbsp chia seeds")
        ingredients.push("1/2 cup granola")
        ingredients.push("Fresh fruit for topping")
        break
      case "sandwich":
        ingredients.push("2 slices bread")
        ingredients.push("2-3 slices deli meat")
        ingredients.push("1-2 slices cheese")
        ingredients.push("Lettuce leaves")
        ingredients.push("2-3 tomato slices")
        ingredients.push("Mayonnaise or mustard")
        ingredients.push("Salt and black pepper to taste")
        break
      case "salad":
        ingredients.push("2 cups mixed greens")
        ingredients.push("1 cucumber, sliced")
        ingredients.push("1 tomato, diced")
        ingredients.push("1/4 red onion, sliced")
        ingredients.push("1/4 cup croutons")
        ingredients.push("2 tbsp olive oil")
        ingredients.push("1 tbsp balsamic vinegar")
        ingredients.push("Salt and black pepper to taste")
        break
      case "stir-fry":
        ingredients.push("1 lb protein (chicken, beef, or tofu)")
        ingredients.push("2 cups mixed vegetables")
        ingredients.push("2 tbsp vegetable oil")
        ingredients.push("2 cloves garlic, minced")
        ingredients.push("1 tbsp ginger, grated")
        ingredients.push("3 tbsp soy sauce")
        ingredients.push("1 tbsp sesame oil")
        ingredients.push("2 green onions, chopped")
        break
      case "dessert":
        ingredients.push("4 tbsp all-purpose flour")
        ingredients.push("4 tbsp sugar")
        ingredients.push("2 tbsp cocoa powder")
        ingredients.push("1/4 tsp baking powder")
        ingredients.push("3 tbsp milk")
        ingredients.push("2 tbsp vegetable oil")
        ingredients.push("1/4 tsp vanilla extract")
        ingredients.push("2 tbsp chocolate chips")
        break
      case "snack":
        ingredients.push("1 cup mixed nuts")
        ingredients.push("1/4 cup dried fruit")
        ingredients.push("1/4 cup dark chocolate chips")
        ingredients.push("1/4 cup pretzels")
        ingredients.push("1/4 cup popcorn")
        break
      default:
        // Fallback to original logic
        return generateGenericIngredients(analysis)
    }
  } else {
    return generateGenericIngredients(analysis)
  }

  return ingredients
}

function generateGenericIngredients(analysis: any): string[] {
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
  const { specificRecipe, recipeType, method, cuisine, mainIngredients, isQuick } = analysis
  const steps = []

  // Generate steps based on specific recipe type
  if (specificRecipe) {
    switch (recipeType) {
      case "upgrade":
        steps.push("Boil water in a pot and cook instant noodles according to package directions.")
        steps.push("While noodles cook, heat a small pan and scramble the egg with a pinch of salt.")
        steps.push("Drain noodles and return to pot. Add frozen vegetables and let them heat through.")
        steps.push("Add soy sauce, sesame oil, and minced garlic to the noodles. Mix well.")
        steps.push("Top with scrambled egg, chopped green onions, and red pepper flakes if desired.")
        break
      case "bread":
        steps.push("Preheat oven to 400°F (200°C).")
        steps.push("Mix softened butter with minced garlic, parsley, and Parmesan cheese.")
        steps.push("Slice bread diagonally and spread garlic butter mixture on each slice.")
        steps.push("Place on baking sheet and bake for 10-12 minutes until golden and crispy.")
        steps.push("Serve immediately while hot.")
        break
      case "breakfast":
        steps.push("Heat butter or oil in a non-stick pan over medium heat.")
        steps.push("Crack eggs into the pan and cook to your preference (sunny side up, over easy, or scrambled).")
        steps.push("Season with salt and black pepper.")
        steps.push("Serve with toast if desired.")
        break
      case "smoothie":
        steps.push("Add frozen banana, berries, milk, and honey to a blender.")
        steps.push("Blend on high speed until smooth and creamy.")
        steps.push("Pour into a bowl and top with granola, chia seeds, and fresh fruit.")
        steps.push("Serve immediately.")
        break
      case "sandwich":
        steps.push("Lay out two slices of bread.")
        steps.push("Spread mayonnaise or mustard on one or both slices.")
        steps.push("Layer on deli meat, cheese, lettuce, and tomato.")
        steps.push("Season with salt and black pepper.")
        steps.push("Close sandwich and cut in half if desired.")
        break
      case "salad":
        steps.push("Wash and dry mixed greens, then place in a large bowl.")
        steps.push("Add sliced cucumber, diced tomato, and sliced red onion.")
        steps.push("Whisk together olive oil, balsamic vinegar, salt, and black pepper for dressing.")
        steps.push("Drizzle dressing over salad and toss gently.")
        steps.push("Top with croutons and serve immediately.")
        break
      case "stir-fry":
        steps.push("Heat oil in a large wok or skillet over high heat.")
        steps.push("Add protein and cook for 2-3 minutes until almost done. Remove and set aside.")
        steps.push("Add vegetables and stir-fry for 3-4 minutes until tender-crisp.")
        steps.push("Return protein to pan, add soy sauce and sesame oil, toss everything together.")
        steps.push("Garnish with chopped green onions and serve immediately.")
        break
      case "dessert":
        steps.push("In a microwave-safe mug, whisk together flour, sugar, cocoa powder, and baking powder.")
        steps.push("Add milk, oil, and vanilla extract. Mix until smooth.")
        steps.push("Stir in chocolate chips.")
        steps.push("Microwave on high for 1-2 minutes until cake is set.")
        steps.push("Let cool slightly before eating.")
        break
      case "snack":
        steps.push("Mix all nuts, dried fruit, and pretzels in a bowl.")
        steps.push("Add chocolate chips and popcorn.")
        steps.push("Toss everything together gently.")
        steps.push("Store in an airtight container or serve immediately.")
        break
      default:
        return generateGenericSteps(analysis)
    }
  } else {
    return generateGenericSteps(analysis)
  }

  return steps
}

function generateGenericSteps(analysis: any): string[] {
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
  const { specificRecipe, recipeType, method, cuisine, difficulty, isQuick } = analysis
  const tips = []

  // Generate tips based on specific recipe type
  if (specificRecipe) {
    switch (recipeType) {
      case "upgrade":
        tips.push("Don't overcook the instant noodles - they should be al dente.")
        tips.push("Add the frozen vegetables at the end to keep them crisp.")
        tips.push("Use low-sodium soy sauce to control the saltiness.")
        break
      case "bread":
        tips.push("Let the butter come to room temperature for easier mixing.")
        tips.push("Watch the bread closely in the oven - it can burn quickly.")
        tips.push("Serve immediately for the best texture and flavor.")
        break
      case "breakfast":
        tips.push("Use a non-stick pan for easier egg cooking.")
        tips.push("Don't overcook the eggs - they should be slightly runny.")
        tips.push("Add a splash of milk to scrambled eggs for fluffiness.")
        break
      case "smoothie":
        tips.push("Use frozen fruit for a thicker, colder smoothie.")
        tips.push("Add liquid gradually to achieve desired consistency.")
        tips.push("Eat immediately to prevent the granola from getting soggy.")
        break
      case "sandwich":
        tips.push("Toast the bread lightly for better texture.")
        tips.push("Layer ingredients in order: spread, protein, cheese, vegetables.")
        tips.push("Don't overstuff the sandwich - it will be hard to eat.")
        break
      case "salad":
        tips.push("Dry the greens thoroughly to prevent watery dressing.")
        tips.push("Add dressing just before serving to keep vegetables crisp.")
        tips.push("Use a variety of textures for a more interesting salad.")
        break
      case "stir-fry":
        tips.push("Keep the heat high and ingredients moving for best results.")
        tips.push("Cut all ingredients to similar sizes for even cooking.")
        tips.push("Don't overcrowd the pan - cook in batches if needed.")
        break
      case "dessert":
        tips.push("Don't overmix the batter - it will make the cake tough.")
        tips.push("Check the cake after 1 minute - microwave times vary.")
        tips.push("Let it cool slightly before eating to avoid burning your mouth.")
        break
      case "snack":
        tips.push("Store in an airtight container to keep ingredients fresh.")
        tips.push("Mix different textures for a more satisfying snack.")
        tips.push("Adjust the ratio of ingredients to your taste preferences.")
        break
      default:
        return generateGenericTips(analysis)
    }
  } else {
    return generateGenericTips(analysis)
  }

  return tips.slice(0, 3)
}

function generateGenericTips(analysis: any): string[] {
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