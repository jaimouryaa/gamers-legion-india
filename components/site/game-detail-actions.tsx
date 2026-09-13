"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { buildWhatsAppLink } from "@/lib/utils";
import type { Game } from "@/lib/types";

export function GameDetailActions({ game }: { game: Game }) {
  const { addItem } = useCart();
  return (
    <div className="flex flex-1 flex-wrap gap-2.5 sm:flex-none">
      <Button
        variant="secondary"
        onClick={() =>
          addItem({
            id: game.id,
            title: game.title,
            slug: game.slug,
            price: game.salePrice,
            originalPrice: game.originalPrice,
            coverImage: game.coverImage,
            genre: game.genre,
          })
        }
      >
        <ShoppingCart size={16} />
        Add to cart
      </Button>
      <a href={buildWhatsAppLink({ gameTitle: game.title, price: game.salePrice, slug: game.slug })} target="_blank" rel="noopener noreferrer">
        <Button>
          <MessageCircle size={16} />
          Buy via WhatsApp
        </Button>
      </a>
    </div>
  );
}
