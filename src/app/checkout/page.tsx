import DynamicCheckoutWrapper from "@/components/dynamic/DynamicCheckoutWrapper";
import { Suspense } from "react";

// Loading component for Suspense fallback
const CheckoutLoading = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export default function CheckoutPage() {
  console.log("CheckoutPage");
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <DynamicCheckoutWrapper />
    </Suspense>
  );
}
