export interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  attributes?: Array<{
    id: number;
    name: string;
    unit: string | null;
    value: string;
    options: string[] | null;
    inputType: string;
    isRequired: number;
    isVariantDimension: number;
  }>;
  basePrice: number;
  variantId: number;
  offerPrice: number;
  totalDiscount: number;
  finalItemPrice: number;
  totalBasePrice: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  companyName: string | null;
  flatNo: string | null;
  streetAddress: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  isBillingAddress: number;
  deliveryInstructions: string | null;
  landmark: string | null;
  countryName: string | null;
  stateName: string;
}

export interface IOrder {
  orderId: number;
  customerId: number | null;
  shippingAddressId: number;
  billingAddressId: number;
  guestId: string;
  originalPrice: number;
  totalItemDiscount: number;
  promocodeId: number | null;
  promocodeDiscount: number;
  subTotal: number;
  vatAmount: number;
  finalPrice: number;
  oStatus: number;
  createdAt: string;
  shippingType: number;
  shippingCharges: number;
  paymentType: number;
  orderItems: OrderItem[];
  orderStatus?: string;
  address: Address;
}

export interface IOrderResponse {
  Status: number;
  Order: IOrder;
}
