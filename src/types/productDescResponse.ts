interface ProductImage {
  productImageId: number;
  productId: number;
  image: string;
  altText: string | null;
  isPrimary: number;
  priority: number;
  imageURL: string;
}

interface VariantImage {
  image: string;
  altText: string | null;
  priority: number | null;
  isPrimary: number | null;
  variantId: number | null;
  variantImageId: number | null;
}

interface Variant {
  variantId: number;
  productId: number;
  basePrice: number;
  offerPrice: number;
  currency: string;
  discountTypeId: number;
  discountValue: number;
  taxClassId: number;
  vat: number;
  sku: string;
  barcode: string;
  qty: number;
  unit: string;
  stock: number;
  weight: number;
  height: number;
  lengthValue: number;
  variantType: string;
  width: number;
  images: VariantImage[];
}

interface IProductDescResponce {
  productId: number;
  storeId: number;
  categoryId: number;
  categoryName: string;
  subcategoryId: number | null;
  subcategoryName: string | null;
  name: string;
  description: string;
  isPhysicalProduct: number;
  productStatus: string;
  variants: Variant[];
  productImages: ProductImage[];
  tags: any[]; // Assuming tags can be any array type
}

export default IProductDescResponce;
