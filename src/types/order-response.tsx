export interface Order {
  orderId: number;
  customerId: number | null;
  shippingAddressId: number;
  billingAddressId: number;
  guestId: string;
  originalPrice: number;
  totalItemDiscount: number;
  promocodeId: number | null;
  promocodeDiscount: number;
  vatAmount: number;
  finalPrice: number;
  oStatus: number;
  orderStatus: string;
  createdAt: string;
  shippingType: number;
  shippingCharges: number;
  orderItemsCount: number;
  paymentType: number;
}

export interface OrderPagination {
  page: number;
  size: number;
  totalOrdersCount: number;
  nextPage: boolean;
  totalPages: number;
}

export interface OrderListResponse {
  Status: number;
  Orders: Order[];
  Pagination: OrderPagination;
}
