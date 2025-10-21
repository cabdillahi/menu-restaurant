"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/app/context/cart-context"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  const currency = items[0]?.food?.Tenant?.currency 

  const formatPrice = (price: number) => {
    return currency === "USD" ? `$${price.toFixed(2)}` : `SHL${price.toFixed(2)}`
  }

  return (
    <Sheet  open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col overflow-y-scroll overflow-x-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Button onClick={() => onOpenChange(false)} className="bg-amber-400 hover:bg-amber-500 text-gray-900">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.food.id}
                    className="flex gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-white flex-shrink-0">
                      <img
                        src={
                          item.food.imageUrl ||
                          `/placeholder.svg?height=80&width=80&query=${
                            encodeURIComponent(item.food.name) || "/placeholder.svg"
                          }`
                        }
                        alt={item.food.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 truncate">{item.food.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{formatPrice(item.food.price)}</p>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.food.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <p className="font-bold text-gray-900">{formatPrice(item.food.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <SheetFooter className="flex-col gap-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={clearCart} className="flex-1 bg-transparent">
                  Clear Cart
                </Button>
                <Button className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900">Checkout</Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
