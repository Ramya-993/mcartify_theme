"use client";
import { Suspense } from "react";
import DynamicResetPasswordWrapper from "@/components/dynamic/DynamicResetPasswordWrapper";
import { useRouter, useSearchParams } from "next/navigation";


// Loading component for Suspense fallback
const ResetPasswordLoading = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export default function ResetPasswordPage() {
  console.log("ResetPasswordPage");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ;
  if (!token) {
    router.push("/");
  }
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <DynamicResetPasswordWrapper token={token} />
    </Suspense>
  );
}
