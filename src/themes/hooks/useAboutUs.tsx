// useAboutUs.tsx
import { AxiosFetcher } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

type AboutUsItem = {
  type: "header" | "contentLeft" | "contentRight";
  image: string;
  title: string;
  enabled: number;
  description: string;
  imageURL: string
};

type AboutUsResponse = {
  Status: number;
  AboutUs: AboutUsItem[];
};

export const useAboutUs = () => {
  return useQuery<AboutUsResponse, Error>({
    queryKey: ["aboutUs"],
    queryFn: async () => {
      const response = await AxiosFetcher.get("/stores/aboutUs");
      return response?.data;
    },
    select: (data) => ({
      ...data,
      AboutUs: data.AboutUs.filter((item) => item.enabled === 1),
    }),
    enabled: true,
    retry: 1,
  });
};