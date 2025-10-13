"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const categories = ["Special Foods", "Mexican", "Pasta", "Appetizer", "Drinks", "Lunch", "More Items"]

const menuItems = [
  {
    id: 1,
    name: "Pasta",
    price: 35.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/delicious-pasta-with-tomato-sauce.jpg",
    category: "Pasta",
  },
  {
    id: 2,
    name: "French Fries",
    price: 55.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/crispy-golden-french-fries.jpg",
    category: "Appetizer",
  },
  {
    id: 3,
    name: "Chicken Shawarma",
    price: 35.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/chicken-shawarma-wrap.png",
    category: "Special Foods",
  },
  {
    id: 4,
    name: "Fish Curry",
    price: 35.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/spicy-fish-curry-with-vegetables.jpg",
    category: "Special Foods",
  },
  {
    id: 5,
    name: "Pasta",
    price: 35.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/delicious-pasta-with-tomato-sauce.jpg",
    category: "Pasta",
  },
  {
    id: 6,
    name: "French Fries",
    price: 55.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/crispy-golden-french-fries.jpg",
    category: "Appetizer",
  },
  {
    id: 7,
    name: "Chicken Shawarma",
    price: 35.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/chicken-shawarma-wrap.png",
    category: "Special Foods",
  },
  {
    id: 8,
    name: "Fish Curry",
    price: 35.0,
    rating: 5,
    description: "Pasta is a type of food typically made from an unleavened dough",
    image: "/spicy-fish-curry-with-vegetables.jpg",
    category: "Special Foods",
  },
]

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState("Pasta")

  const filteredItems = menuItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900">Our Regular Menu Pack</h1>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "bg-amber-400 hover:bg-amber-500 text-gray-900 border-none rounded-full px-6"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-full px-6"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white"
            >
              <div className="aspect-square relative bg-gradient-to-br from-orange-50 to-white p-4">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2 text-gray-900">{item.name}</h3>
                <div className="flex gap-1 mb-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                  <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full px-6">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
