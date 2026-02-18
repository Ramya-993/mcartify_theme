export interface Customer {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  customerId?: string;
  countryCode?: string;
  dob?: string;
  storeId?: number;
  phone?: string;
  altCountryCode?: string | null;
  altPhone?: string | null;
  areaPincode?: string | null;
  city?: string | null;
  customerType?: number;
  genderValue?: string;
  avatar?: string;
  location?: string;
  addresses?: Array<{
    id: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: number;
  }>;
}
 