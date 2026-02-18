// useFaq.tsx
import { AxiosFetcher } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

type FaqItem = {
  title: string;
  description: string;
};

type FaqData = {
  faqs: FaqItem[];
  enabled: boolean;
  page_title: string;
};

type FaqResponse = {
  Status: number;
  FAQs: FaqData;
};

export const useFaq = () => {
  return useQuery<FaqResponse, Error>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const response = await AxiosFetcher.get("/stores/faqs");
      return response?.data;
    },
    select: (data) => ({
      ...data,
      FAQs: {
        ...data.FAQs,
        faqs: data.FAQs.enabled ? data.FAQs.faqs : [],
      },
    }),
    enabled: true,
    retry: 1,
  });
};