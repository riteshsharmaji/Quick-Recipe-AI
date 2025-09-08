import { RecipeGenerator } from "@/components/recipe-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Quick Recipe AI</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Get delicious, easy recipes in seconds with AI-powered suggestions
          </p>
        </div>
        <RecipeGenerator />
      </div>
    </main>
  )
}
