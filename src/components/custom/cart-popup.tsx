"use client";

import { deleteFromCart } from "@/store/slices/cart";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

// Shadcn UI imports
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CartPopupProps {
  className?: string;
}

/**
 * Cart popup component that shows current cart items and totals
 *
 * @param className - Optional additional CSS classes
 */
const CartPopup = ({ className }: CartPopupProps) => {
  const { data: cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const hasItems = cart?.CartItems?.length > 0;
  const itemCount = cart?.CartItems?.length || 0;

  const handleDeleteItem = (variantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteFromCart(variantId));
  };

  const handleShopNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/");
  };

  return (
    <Card
      className={cn("absolute top-12 right-0 z-50 w-80 shadow-md", className)}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Your Cart
          {hasItems && (
            <Badge variant="secondary" className="ml-auto">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {hasItems ? (
          <div className="flex flex-col">
            <ScrollArea className="h-[250px] px-4">
              <div className="flex flex-col gap-2 py-2">
                {cart.CartItems.map((item: ICartItem, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md p-2 group hover:bg-muted/50"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                      <h1></h1>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>
                          {item.qty} {item.unit}
                        </span>
                        <span className="mx-1">•</span>
                        <span>x{item.quantity}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteItem(item.variantId, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="relative h-16 w-16 mb-3">
              <Image
                src="/images/others/cart-empty-small.png"
                alt="Empty cart"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-sm text-muted-foreground mb-4 text-center">
              Your cart is empty
            </p>

            <Button onClick={handleShopNow} className="gap-2" size="sm">
              <ShoppingBag className="h-4 w-4" />
              Shop Now
            </Button>
          </div>
        )}
      </CardContent>

      {hasItems && (
        <>
          <Separator />
          <CardFooter className="p-4 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="ml-2 font-medium">{cart?.FinalPrice}</span>
            </div>

            <Button asChild size="sm">
              <Link href="/cart">View Cart</Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default CartPopup;
