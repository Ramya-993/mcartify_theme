import IVariant from "./variant"

interface IProduct {
    categoryId: number
    categoryName: string
    createdAt: string
    description: string
    image: string
    imageURL: string
    isPhysicalProduct: number
    name: string
    productId: number
    productStatus: "published" | null
    published: number
    subcategoryId: null | number
    subcategoryName: null | string
    updatedAt: string
    variants: IVariant[]
    avgRating: number
    slug: string
}

export default IProduct

