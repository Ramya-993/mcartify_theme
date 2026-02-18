export interface ISubcategory {
  subcategoryId: number;
  storeId: number;
  categoryId: number;
  name: string;
  image: string;
  slug: string; // Added for SEO-friendly URLs
}

interface ICategory {
  categoryId: number;
  name: string;
  image: string;
  subcategories: ISubcategory;
  slug: string; // Added for SEO-friendly URLs

  description?: string;
  noOfProducts?: number;
}

export default ICategory;
