"use client";

import { useDynamicComponent } from "@/hooks/useDynamicComponent";
import IProduct from "@/types/product";
import { useEffect, useState } from "react";

interface IProductResponse {
  Products: IProduct[];
  Status: number;
  Message?: string;
}

// Client-side Product Wrapper Component
const ClientProductsWrapper = ({
  products,
}: {
  products: IProductResponse;
}) => {
  const DynamicProduct = useDynamicComponent("Product");
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client side to prevent SSR loading indicators
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!products.Products || products.Products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          No products found
        </h2>
        <p className="text-gray-500">
          Please try adjusting your search criteria or browse our categories.
        </p>
      </div>
    );
  }

  // Don't show any loading indicators - render products immediately for crawlers
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
      {products.Products.map((product) => (
        <div key={product.productId} className="h-full">
          {/* For SSR/crawlers: render immediately without loading states */}
          {isClient ? (
            <DynamicProduct product={product} />
          ) : (
            // Fallback content for SSR/crawlers - simple product card
            <div className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="aspect-square bg-gray-100 rounded mb-2"></div>
              <h3 className="font-medium text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {product.categoryName}
              </p>
              {product.variants && product.variants.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-600">
                    ₹
                    {product.variants[0].offerPrice ||
                      product.variants[0].basePrice}
                  </span>
                  {product.variants[0].offerPrice && (
                    <span className="text-xs line-through text-gray-400">
                      ₹{product.variants[0].basePrice}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientProductsWrapper;
