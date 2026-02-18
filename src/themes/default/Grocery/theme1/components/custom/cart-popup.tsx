"use client";

import { deleteFromCart } from "@/store/slices/cart";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, ShoppingBag, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useState } from "react";

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
import StoreStatusDialog from "../StoreStatusDialog";

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
  const storeStatus = useSelector(
    (state: RootState) => state.store.storestatus
  );
  const isStoreOpen = useSelector(
    (state: RootState) => state.store.store?.isStoreOpen
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [storeClosedDialog, setStoreClosedDialog] = useState(false);

  const hasItems = cart?.CartItems?.length > 0;
  const itemCount = cart?.CartItems?.length || 0;

  // Check if store is closed due to being paused or outside business hours
  const isStoreClosed =
    storeStatus?.storePaused || !isStoreOpen?.isStoreOpenNow;

  const handleDeleteItem = (
    variantId: number,
    itemName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    dispatch(deleteFromCart(variantId));

    // Show toast notification
    toast.success("Item Removed", {
      duration: 3000,
      style: {
        background: "var(--background)",
        color: "var(--foreground)",
        border: "1px solid var(--primary)",
      },
      className: "border-primary",
      actionButtonStyle: {
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        border: "1px solid var(--primary)",
      },
    });
  };

  const handleShopNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/");
  };

  const handleViewCart = (e: React.MouseEvent) => {
    // Check store status before allowing navigation to cart
    if (isStoreClosed) {
      e.preventDefault();
      e.stopPropagation();
      setStoreClosedDialog(true);
      return;
    }
    router.push("/cart");
  };

  return (
    <>
      <Card
        className={cn(
          "absolute top-12 right-0 z-50 w-80 max-w-sm shadow-md",
          className
        )}
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
          {/* Store Status Warning */}
          {hasItems && isStoreClosed && (
            <div className="mx-4 mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {storeStatus?.storePaused
                    ? "Store is temporarily closed"
                    : "Store is closed for business hours"}
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                You can view your cart but checkout is currently unavailable.
              </p>
            </div>
          )}

          {hasItems ? (
            <div className="flex flex-col">
              <ScrollArea className="h-[250px] px-4">
                <div className="flex flex-col gap-2 py-2">
                  {cart.CartItems.map((item: ICartItem, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-md p-2 group hover:bg-muted/50"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 overflow-hidden min-w-0 max-w-[180px]">
                        <p
                          className="text-sm font-medium leading-tight overflow-hidden text-ellipsis"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                          }}
                          title={item.name}
                        >
                          {item.name}
                        </p>

                        {/* Variant Attributes Display */}
                        {/* {item.attributes && item.attributes.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap mb-1">
                            {item.attributes
                              .filter((attr) => attr.isVariantDimension === 1)
                              .map((attr, attrIndex) => (
                                <span
                                  key={attrIndex}
                                  className={`text-[9px] px-1 py-0.5 rounded-full font-medium border ${
                                    attr.name.toLowerCase() === "color"
                                      ? "bg-purple-50 text-purple-700 border-purple-200"
                                      : attr.name.toLowerCase() === "size"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                                  }`}
                                >
                                  {attr.value}
                                </span>
                              ))}
                          </div>
                        )} */}

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
                        className="h-8 w-8 text-destructive flex-shrink-0 mt-0.5"
                        onClick={(e) =>
                          handleDeleteItem(item.variantId, item.name, e)
                        }
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
                <span className="ml-2 font-medium">{cart?.SubTotal}</span>
              </div>

              <Button
                size="sm"
                onClick={handleViewCart}
                className={isStoreClosed ? "cursor-pointer" : ""}
              >
                View Cart
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      {/* Store Status Dialog */}
      <StoreStatusDialog
        isOpen={storeClosedDialog}
        onOpenChange={setStoreClosedDialog}
        storeStatus={storeStatus || {}}
      />
    </>
  );
};

export default CartPopup;
