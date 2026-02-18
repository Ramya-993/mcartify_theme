import ICartItem from "./cartItem";

interface Icart {
  Status: number;
  CartId: number;
  CartItems: ICartItem[];
  OriginalPrice: number;
  TotalItemDiscount: number;
  Promocode: null | string;
  PromocodeDiscount: number;
  VAT: number;
  NoOfProducts: number;
  NoOfItems: number;
  guestToken: string;
}

export default Icart;
