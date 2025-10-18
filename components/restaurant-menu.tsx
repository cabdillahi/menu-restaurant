"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search, Loader2 } from "lucide-react"
import type { Food, Category } from "@/lib/types"
import { fetchFoods, fetchCategories } from "@/lib/api"

interface RestaurantMenuProps {
  tenantName: string
}

export default function RestaurantMenu({ tenantName }: RestaurantMenuProps) {
  const [foods, setFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const [foodsResponse, categoriesResponse] = await Promise.all([
          fetchFoods(tenantName),
          fetchCategories(tenantName),
        ])

        setFoods(foodsResponse.data)
        setCategories(categoriesResponse.data)

        // Set first category as active if available
        if (categoriesResponse.data.length > 0) {
          setActiveCategory(categoriesResponse.data[0].id.toString())
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [tenantName])

  // Filter and search foods
  const filteredFoods = useMemo(() => {
    let result = foods

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((food) => food.categoryId.toString() === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (food) => food.name.toLowerCase().includes(query) || food.description.toLowerCase().includes(query),
      )
    }

    return result
  }, [foods, activeCategory, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 text-balance">
          Our Regular Menu Pack
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-full border-gray-200 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
            className={
              activeCategory === "all"
                ? "bg-amber-400 hover:bg-amber-500 text-gray-900 border-none rounded-full px-6"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-6"
            }
          >
            All Items
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id.toString() ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id.toString())}
              className={
                activeCategory === category.id.toString()
                  ? "bg-amber-400 hover:bg-amber-500 text-gray-900 border-none rounded-full px-6"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-6"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="text-center text-gray-600 mb-6">
            Found {filteredFoods.length} {filteredFoods.length === 1 ? "item" : "items"}
          </p>
        )}

        {/* Menu Items Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white"
              >
                <div className="aspect-square relative bg-gradient-to-br from-orange-50 to-white p-4">
                  <img
                    src={
                      food.imageUrl || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(food.name)}`
                    }
                    alt={food.name}
                    className="w-full h-full object-contain rounded-lg hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{food.name}</h3>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{food.description}</p>
                  <p className="text-xs text-gray-500 mb-4">{food.category.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${food.price.toFixed(2)}</span>
                    <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full px-6">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Reservation Section */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 text-balance">
              Do You Have Any Dinner Plan Today? Reserve Your Table
            </h2>
            <p className="text-gray-700 mb-6 max-w-xl">
              Make online reservations, read restaurant reviews from diners, and earn points towards free meals.
              OpenTable is a real-time online reservation network.
            </p>
            <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full px-8 py-6 text-lg font-semibold">
              Make Reservation
            </Button>
          </div>
          <div className="flex-shrink-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-50 blur-2xl"></div>
              <img
                src="/delicious-dinner-bowl-with-vegetables-and-meat.jpg"
                alt="Dinner bowl"
                className="relative w-full h-full object-cover rounded-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
