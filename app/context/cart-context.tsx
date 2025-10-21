"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Food, CartItem } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addToCart: (food: Food) => void
  removeFromCart: (foodId: number) => void
  updateQuantity: (foodId: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (food: Food) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.food.id === food.id)

      if (existingItem) {
        return currentItems.map((item) => (item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...currentItems, { food, quantity: 1 }]
    })
  }

  const removeFromCart = (foodId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.food.id !== foodId))
  }

  const updateQuantity = (foodId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId)
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.food.id === foodId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
