"use client";

import { useCart } from "@/app/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <Button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full shadow-lg h-14 px-6"
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      <span className="font-semibold">Cart</span>
      {totalItems > 0 && (
        <span className="ml-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
