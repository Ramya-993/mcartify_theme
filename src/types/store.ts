export interface StoreData {
  Status: number;
  Store: {
    storeName: string;
    logo: string;
    templateId: number;
    subdomain: string;
    serviceNeeded: string;
    serviceName: string;
  };
  Channels: {
    storeId: number;
    title: string;
    description: string;
    keywords: string;
    logo: string;
    channelName: string;
    logoURL: string;
  };
  ServiceLocation: any;
}
