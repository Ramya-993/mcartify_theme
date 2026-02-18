import DynamicRefundAndCancellationPolicyWrapper from "@/components/dynamic/DynamicRefundAndCancellationPolicyWrapper";
import { Suspense } from "react";

// Loading component for Suspense fallback
const RefundAndCancellationPolicyLoading = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export default function RefundAndCancellationPolicyPage() {
  console.log("RefundAndCancellationPolicyPage");
  return (
    <Suspense fallback={<RefundAndCancellationPolicyLoading />}>
      <DynamicRefundAndCancellationPolicyWrapper />
    </Suspense>
  );
}
