import IProduct from "./product";
import IProductImage from "./productImageVariant";

export interface IProductVariant {
  variantId: number;
  basePrice: number;
  offerPrice: number;
  currency: string;
  discountTypeId: number;
  discountValue: number;
  qty: number;
  unit: string;
  stock: number;
  variantType: string;
  images: IProductImage[];
  discount: number;
  itemPrice: number;
}

// export interface IProduct {
//   productId: number;
//   storeId: number;
//   categoryId: number;
//   subcategoryId: number | null;
//   image: string;
//   categoryName: string;
//   subcategoryName: string | null;
//   name: string;
//   description: string;
//   isPhysicalProduct: number;
//   productStatus: string;
//   published: boolean | null;
//   createdAt: string;
//   updatedAt: string;
//   isNew: number;
//   avgRating: number;
//   imageURL: string;
//   variants: IProductVariant[];
// }

export interface IPagination {
  page: number;
  size: number;
  totalProductsCount: number;
  nextPage: boolean;
  totalPages: number;
}

export interface IProductResponse {
  Status: number;
  Products: IProduct[];
  Pagination: IPagination;
}

export default IProductResponse;
