"use client";
import { Suspense } from "react";
import DynamicContactUsWrapper from "@/components/dynamic/DynamicContactUsWrapper";

// Loading component for Suspense fallback
const ContactUsLoading = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export default function ContactUsPage() {
  console.log("ContactUsPage");
  return (
    <Suspense fallback={<ContactUsLoading />}>
      <DynamicContactUsWrapper />
    </Suspense>
  );
}
