"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Shuffle, Clock, Users, Copy, Heart, Share2, ChefHat, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Recipe {
  title: string
  cookingTime: string
  servings: string
  ingredients: string[]
  steps: string[]
  tips: string[]
}

export function RecipeGenerator() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [inputMode, setInputMode] = useState<"random" | "manual" | "pantry">("random")
  const [manualInput, setManualInput] = useState("")
  const [pantryIngredients, setPantryIngredients] = useState("")
  const [timeLimit, setTimeLimit] = useState("")
  const [dietPreference, setDietPreference] = useState("")
  const [effortLevel, setEffortLevel] = useState("")
  const [favorites, setFavorites] = useState<Recipe[]>([])
  const [activeTab, setActiveTab] = useState("generate")
  const { toast } = useToast()

  const randomRecipeTypes = [
    "5-minute garlic bread",
    "quick egg breakfast",
    "vegetarian pasta",
    "healthy smoothie bowl",
    "easy sandwich",
    "simple salad",
    "quick stir-fry",
    "microwave mug cake",
    "no-cook snack",
    "instant noodle upgrade",
  ]

  const generateRecipe = async () => {
    setLoading(true)
    try {
      let prompt = ""

      if (inputMode === "random") {
        const randomType = randomRecipeTypes[Math.floor(Math.random() * randomRecipeTypes.length)]
        prompt = `Give me a quick, easy, and delicious recipe for ${randomType}.`
      } else if (inputMode === "manual") {
        prompt = `Give me a quick, easy, and delicious recipe for ${manualInput}.`
      } else if (inputMode === "pantry") {
        prompt = `Create a quick, easy, and delicious recipe using these ingredients I have: ${pantryIngredients}. You can suggest adding 1-2 common pantry staples if needed.`
      }

      // Add filters to prompt
      if (timeLimit) prompt += ` It should take less than ${timeLimit} minutes.`
      if (dietPreference) prompt += ` Make it ${dietPreference}.`
      if (effortLevel) prompt += ` Keep the effort level ${effortLevel}.`

      prompt += ` Provide the response in this exact JSON format:
      {
        "title": "Recipe Name",
        "cookingTime": "X minutes",
        "servings": "X servings",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "steps": ["step 1", "step 2"],
        "tips": ["tip 1", "tip 2"]
      }
      
      Keep ingredients simple and common (max 8 items). Keep steps clear and concise (max 5 steps). Include 2-3 helpful tips.`

      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recipe")
      }

      const data = await response.json()
      setRecipe(data.recipe)
      setActiveTab("recipe")
    } catch (error) {
      console.error("Error generating recipe:", error)
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyRecipe = () => {
    if (!recipe) return

    const recipeText = `${recipe.title}

⏱️ ${recipe.cookingTime} | 👥 ${recipe.servings}

Ingredients:
${recipe.ingredients.map((ing) => `• ${ing}`).join("\n")}

Instructions:
${recipe.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Tips:
${recipe.tips.map((tip) => `💡 ${tip}`).join("\n")}`

    navigator.clipboard.writeText(recipeText)
    toast({
      title: "Recipe copied!",
      description: "Recipe has been copied to your clipboard.",
    })
  }

  const saveToFavorites = () => {
    if (!recipe) return

    const isAlreadyFavorite = favorites.some((fav) => fav.title === recipe.title)
    if (isAlreadyFavorite) {
      toast({
        title: "Already saved",
        description: "This recipe is already in your favorites.",
      })
      return
    }

    setFavorites((prev) => [...prev, recipe])
    toast({
      title: "Saved to favorites!",
      description: "Recipe has been added to your favorites.",
    })
  }

  const shareRecipe = async () => {
    if (!recipe) return

    const recipeText = `Check out this recipe: ${recipe.title}\n\n⏱️ ${recipe.cookingTime} | 👥 ${recipe.servings}\n\nGenerated with Quick Recipe AI!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipeText,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(recipeText)
        toast({
          title: "Recipe copied!",
          description: "Recipe link copied to clipboard for sharing.",
        })
      }
    } else {
      navigator.clipboard.writeText(recipeText)
      toast({
        title: "Recipe copied!",
        description: "Recipe copied to clipboard for sharing.",
      })
    }
  }

  const removeFromFavorites = (recipeTitle: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.title !== recipeTitle))
    toast({
      title: "Removed from favorites",
      description: "Recipe has been removed from your favorites.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Recipe</TabsTrigger>
          <TabsTrigger value="recipe">Current Recipe</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>What would you like to cook?</CardTitle>
              <CardDescription>
                Get a random suggestion, tell us what you're craving, or use what you have
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={inputMode === "random" ? "default" : "outline"}
                  onClick={() => setInputMode("random")}
                  className="flex-1 min-w-fit"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Surprise Me
                </Button>
                <Button
                  variant={inputMode === "manual" ? "default" : "outline"}
                  onClick={() => setInputMode("manual")}
                  className="flex-1 min-w-fit"
                >
                  <ChefHat className="w-4 h-4 mr-2" />I Know What I Want
                </Button>
                <Button
                  variant={inputMode === "pantry" ? "default" : "outline"}
                  onClick={() => setInputMode("pantry")}
                  className="flex-1 min-w-fit"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Use My Pantry
                </Button>
              </div>

              {inputMode === "manual" && (
                <div className="space-y-2">
                  <Label htmlFor="recipe-input">Recipe type or ingredients</Label>
                  <Input
                    id="recipe-input"
                    placeholder="e.g., chicken pasta, vegetarian lunch, chocolate dessert"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                  />
                </div>
              )}

              {inputMode === "pantry" && (
                <div className="space-y-2">
                  <Label htmlFor="pantry-input">What ingredients do you have?</Label>
                  <Textarea
                    id="pantry-input"
                    placeholder="e.g., eggs, cheese, bread, tomatoes, onions..."
                    value={pantryIngredients}
                    onChange={(e) => setPantryIngredients(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Time Limit</Label>
                  <Select value={timeLimit} onValueChange={setTimeLimit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Diet Preference</Label>
                  <Select value={dietPreference} onValueChange={setDietPreference}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any diet</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="gluten-free">Gluten-free</SelectItem>
                      <SelectItem value="dairy-free">Dairy-free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Effort Level</Label>
                  <Select value={effortLevel} onValueChange={setEffortLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any effort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any effort</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateRecipe}
                disabled={
                  loading ||
                  (inputMode === "manual" && !manualInput.trim()) ||
                  (inputMode === "pantry" && !pantryIngredients.trim())
                }
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  "Generate Recipe"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipe">
          {/* Recipe Display */}
          {recipe ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-balance">{recipe.title}</CardTitle>
                    <div className="flex gap-4 mt-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.cookingTime}
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {recipe.servings}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyRecipe} variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={saveToFavorites} variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={shareRecipe} variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ingredients */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-pretty">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                {recipe.tips.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Tips</h3>
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent text-lg">💡</span>
                          <span className="text-pretty">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ChefHat className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recipe generated yet</h3>
                <p className="text-muted-foreground text-center mb-4">Generate a recipe to see it here</p>
                <Button onClick={() => setActiveTab("generate")}>Generate Recipe</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorite Recipes</CardTitle>
              <CardDescription>
                {favorites.length === 0
                  ? "Save recipes you love to access them anytime"
                  : `You have ${favorites.length} saved recipe${favorites.length === 1 ? "" : "s"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Generate and save recipes to build your collection
                  </p>
                  <Button onClick={() => setActiveTab("generate")}>Generate Recipe</Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {favorites.map((fav, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{fav.title}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {fav.cookingTime}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {fav.servings}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              onClick={() => {
                                setRecipe(fav)
                                setActiveTab("recipe")
                              }}
                              variant="outline"
                              size="sm"
                            >
                              View
                            </Button>
                            <Button onClick={() => removeFromFavorites(fav.title)} variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">
                          {fav.ingredients.slice(0, 3).join(", ")}
                          {fav.ingredients.length > 3 && "..."}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
