// Faq.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { useFaq } from "@/themes/hooks/useFaq";

const FaqHeader = ({ title }: { title: string }) => (
  <div className="bg-gradient-to-r from-(color:--primary) to-(color:--primary-hover) text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <HelpCircle className="mx-auto h-20 w-20 md:h-24 md:w-24 mb-6 opacity-90" />
      <h1 className="text-4xl md:text-6xl font-bold mb-6 break-anywhere">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto break-anywhere">
        Find answers to common questions about our services and support.
      </p>
    </div>
  </div>
);

const EmptyFaqState = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="py-16"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No FAQs Available
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto break-anywhere">
                We&apos;re currently updating our FAQ section. Please check back
                later or contact us directly for any questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </motion.section>
);

const FaqList = ({
  faqs,
}: {
  faqs: { title: string; description: string }[];
}) => {
  if (!faqs || faqs.length === 0) {
    return <EmptyFaqState />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 break-anywhere">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto break-anywhere">
            Get quick answers to the most commonly asked questions about our
            services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors break-anywhere">
                      {faq.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2 break-anywhere">
                      {faq.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  );
};

const FaqSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    {/* Hero Skeleton */}
    <div className="bg-gradient-to-r from-(color:--primary) to-(color:--primary-hover) py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto h-20 w-20 md:h-24 md:w-24 mb-6 bg-white/20 rounded-full animate-pulse"></div>
        <Skeleton className="h-12 md:h-16 w-96 mx-auto mb-6 bg-white/20" />
        <Skeleton className="h-6 md:h-8 w-full max-w-3xl mx-auto bg-white/20" />
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default function Faq() {
  const { data, isLoading } = useFaq();

  if (isLoading) return <FaqSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main>
        <FaqHeader
          title={data?.FAQs?.page_title || "Frequently Asked Questions"}
        />
        <FaqList faqs={data?.FAQs?.faqs || []} />
      </main>
    </div>
  );
}
