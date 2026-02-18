interface Address {
  country: string;
  pincode: string;
  stateCity: string;
  areaLocation: string;
  apartmentBuilding: string;
}

interface PhoneNumbers {
  [key: string]: string;
}

interface EmailAddresses {
  [key: string]: string;
}

interface GetInTouchFields {
  email: string;
  phone: string;
  message: string;
  subject: string;
  userName: string;
}

interface MenuItem {
  name: string;
  itemName: string;
  priority: number;
  enabled: number;
  path: string;
}

interface LoginType {
  phoneOtp: number;
  emailPassword: number;
  phonePassword: number;
  emailOtp: number;
  allowGuest: number;
}

interface FooterSectionItem {
  path: string;
  enabled: number;
  itemId: number;
  priority: number;
  itemName: string;
}

interface FooterSection {
  sectionId: number;
  sectionName: string;
  enabled: number;
  priority: number;
  sectionItems: FooterSectionItem;
}

interface Store {
  storeName: string;
  logo: string;
  logoDescription: string;
  templateId: number;
  subdomain: string;
  serviceNeeded: string;
  serviceName: string;
  address: Address;
  phoneNumbers: PhoneNumbers;
  emailAddresses: EmailAddresses;
  getInTouchFields: GetInTouchFields;
  menu: MenuItem;
  loginTypes: LoginType;
  footerSections: FooterSection;
}

interface Channels {
  [key: string]: any;
}

interface RootObject {
  Status: number;
  Store: Store;
  Channels: Channels;
}

export type RootObjectType = RootObject;
