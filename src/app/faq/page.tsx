
import DynamicFaqWrapper from "@/components/dynamic/DynamicFaqWrapper";
import { Suspense } from "react";

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export default function FaqPage() {
  console.log("FaqPage");
  return (
    <Suspense fallback={<Loading />}>
      <DynamicFaqWrapper />
    </Suspense>
  );
}
