import { deleteFromCart } from "@/store/slices/cart";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const CartPopup = () => {
  const [error, setError] = useState(false);
  const { data: cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <Card className="absolute top-10 -right-12 w-[300px] z-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {cart?.CartItems?.length > 0 ? (
          <div className="flex flex-col">
            <ScrollArea className="h-[250px] px-4">
              <div className="flex flex-col gap-2">
                {cart.CartItems.map((item: ICartItem, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-md p-2 group hover:bg-muted/50"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="size-10 shrink-0 rounded object-contain"
                    />
                    <div className="grow text-left">
                      <p className="text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.qty} {item.unit} × {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteFromCart(item.variantId));
                      }}
                    >
                      <span className="material-symbols-rounded text-destructive">
                        delete
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <CardFooter className="flex items-center justify-between border-t p-4 mt-auto">
              <div className="text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="ml-2 font-medium">{cart?.FinalPrice}</span>
              </div>
              <Button asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
            </CardFooter>
          </div>
        ) : (
          <div className="p-4 text-center">
            <div className="flex justify-center">
              <Image
                src="/images/others/cart-empty-small.png"
                height={100}
                width={100}
                className="size-12"
                alt="empty cart"
              />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">
              No products in the cart.
            </p>
            <Button
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/");
              }}
            >
              Shop now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartPopup;
