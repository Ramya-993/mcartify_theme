interface ICartItem {
  cartId: number;
  productId: number;
  variantId: number;
  quantity: number;
  name: string;
  basePrice: number;
  offerPrice: number;
  currency: string;
  discountTypeId: number;
  discountValue: number;
  vat: number;
  qty: number;
  unit: string;
  stock: number;
  variantType: string;
  image: string;
  totalBasePrice: number;
  totalDiscount: number;
  finalItemPrice: number;
  // Additional product details
  categoryName?: string;
  brandName?: string;
  discountPercentage?: number;
  rating?: number;
  isNew?: boolean;
  slug?: string;
  attributes?: Array<{
    id: number;
    name: string;
    unit: string | null;
    value: string;
    options: string[];
    inputType: string;
    isRequired: number;
    isVariantDimension: number;
  }>;
}

export default ICartItem;
