import IProductImage from "./productImageVariant"

interface IVariant {
    basePrice: number
    currency: string
    discountTypeId: number
    discountValue: number
    offerPrice: number
    qty: number
    stock: number
    unit: string
    variantId: number
    variantType: string
    variants: IProductImage[]
}

export default IVariant