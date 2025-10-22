"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, Search } from "lucide-react";
import type { Food, Category } from "@/lib/types";
import { fetchFoods, fetchCategories } from "@/lib/api";
import { CartButton } from "@/components/cart-button";
import { CartDrawer } from "@/components/cart-drawer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/app/context/cart-context";
import { MenuSkeletonLoader } from "../components/skeleton-loaders";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RestaurantMenuProps {
  tenantName: string;
}

export default function RestaurantMenu({ tenantName }: RestaurantMenuProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const foodRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [foodsResponse, categoriesResponse] = await Promise.all([
          fetchFoods(tenantName),
          fetchCategories(tenantName),
        ]);

        setFoods(foodsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tenantName]);

  useEffect(() => {
    if (!loading && foods.length > 0) {
      // Animate header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      }

      // Animate search bar
      if (searchRef.current) {
        gsap.fromTo(
          searchRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.2,
            ease: "back.out(1.7)",
          }
        );
      }

      // Animate categories
      categoryRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { opacity: 0, y: 30, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              delay: 0.3 + index * 0.1,
              ease: "back.out(1.7)",
            }
          );
        }
      });

      // Animate food cards with scroll trigger
      foodRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(
            ref,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: 0.5 + (index % 4) * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref,
                start: "top bottom-=100",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }
  }, [loading, foods]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);

    // Animate food cards on category change
    foodRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { opacity: 0, scale: 0.95, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            delay: index * 0.05,
            ease: "power2.out",
          }
        );
      }
    });
  };

  const handleAddToCart = (food: Food) => {
    addToCart(food);
    toast({
      title: "Added to cart",
      description: `${food.name} has been added to your cart.`,
    });
  };

  // Filter and search foods
  const filteredFoods = useMemo(() => {
    let result = foods;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(
        (food) => food.categoryId.toString() === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (food) =>
          food.name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [foods, activeCategory, searchQuery]);

  if (loading) {
    return <MenuSkeletonLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <CartButton onClick={() => setCartOpen(true)} />

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-12">
        <h1
          ref={headerRef}
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900 text-balance"
        >
          Our Regular Menu Pack
        </h1>

        {/* Search Bar */}
        <div ref={searchRef} className="max-w-2xl mx-auto mb-8">
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

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* All Items Category */}
          <button
            ref={(el) => {
              categoryRefs.current[0] = el;
            }}
            onClick={() => handleCategoryChange("all")}
            className={`relative overflow-hidden w-32 h-32 rounded-2xl transition-all ${
              activeCategory === "all"
                ? "ring-4 ring-amber-400 shadow-2xl scale-105"
                : "shadow-lg hover:shadow-xl hover:scale-105"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative h-full flex flex-col items-center justify-center text-white">
              <span className="text-4xl mb-2">🍽️</span>
              <span className="font-bold text-sm px-2 text-center">
                All Items
              </span>
            </div>
          </button>

          {categories.map((category, index) => (
            <button
              key={category.id}
              ref={(el) => {
                categoryRefs.current[index + 1] = el;
              }}
              onClick={() => handleCategoryChange(category.id.toString())}
              className={`relative overflow-hidden w-32 h-32 rounded-2xl transition-all ${
                activeCategory === category.id.toString()
                  ? "ring-4 ring-amber-400 shadow-2xl scale-105"
                  : "shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              <img
                src={
                  category.imageUrl ||
                  `/placeholder.svg?height=200&width=200&query=${
                    encodeURIComponent(category.name) || "/placeholder.svg"
                  }`
                }
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="relative h-full flex items-end justify-center pb-3">
                <span className="font-bold text-sm text-white px-2 text-center drop-shadow-lg">
                  {category.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="text-center text-gray-600 mb-6">
            Found {filteredFoods.length}{" "}
            {filteredFoods.length === 1 ? "item" : "items"}
          </p>
        )}

        {/* Menu Items Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No items found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredFoods.map((food, index) => (
              <div
                key={food.id}
                ref={(el) => {
                  foodRefs.current[index] = el;
                }}
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-white h-full">
                  <div className="relative w-full h-64 bg-gradient-to-br from-orange-50 to-white overflow-hidden">
                    <img
                      src={
                        food.imageUrl ||
                        `/placeholder.svg?height=300&width=300&query=${
                          encodeURIComponent(food.name) || "/placeholder.svg"
                        }`
                      }
                      alt={food.name}
                      className="w-full h-full object-cover px-3 rounded-3xl py-2 hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-xl mb-2 text-gray-900">
                      {food.name}
                    </h3>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {food.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {food.category.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {food?.Tenant?.currency === "USD"
                          ? `$${food?.price.toFixed(2)}`
                          : `SHL${food.price.toFixed(2)}`}
                      </span>
                      <Button
                        onClick={() => handleAddToCart(food)}
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full px-6"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
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
              Make online reservations, read restaurant reviews from diners, and
              earn points towards free meals. OpenTable is a real-time online
              reservation network.
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
  );
}
