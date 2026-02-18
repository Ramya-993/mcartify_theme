"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AxiosFetcher } from "@/utils/axios";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentFailedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get error information from URL parameters
  const reason = searchParams.get("reason") || "Unknown error occurred";
  const orderId = searchParams.get("orderId") || "";

  // Copy order ID to clipboard
  const copyOrderId = async () => {
    if (orderId) {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Retry payment function
  const handleRetryPayment = async () => {
    if (!orderId) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await AxiosFetcher.post("/stores/payment/retry", {
        orderId: orderId,
      });

      if (response.data.Status) {
        if (response.data?.PaymentDetails?.id) {
          const options = {
            key: response.data.Gateway.apiKey,
            amount: response.data.PaymentDetails.amount,
            currency: response.data.PaymentDetails.currency,
            name: "MCartify",
            description: "Order Payment",
            order_id: response.data.PaymentDetails.id,
            handler: async (response: any) => {
              router.replace(
                `/order-success?orderId=${
                  response.data.OrderID || response.razorpay_order_id
                }`
              );
            },
            modal: {
              ondismiss: () => {
                router.replace(
                  `/payment-failed?reason=Payment+dismissed&orderId=${response.data.PaymentDetails.id}`
                );
              },
            },
            prefill: {
              name: localStorage.getItem("userName") || "",
              email: localStorage.getItem("userEmail") || "",
              contact: localStorage.getItem("userPhone") || "",
            },
            theme: {
              color: "#10b981",
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } else {
        throw new Error(response.data.Message || "Could not retry payment");
      }
    } catch (error: any) {
      console.error("Failed to retry payment:", error);
      const errorMessage =
        error?.response?.data?.Message || "Failed to retry payment";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br   flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl  ">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-200">
            <AlertCircle className="h-8 w-8 text-red-700" />
          </div>

          {/* Title */}
          <h1 className="mb-4 text-2xl font-bold text-red-900">
            Payment Failed
          </h1>

          {/* Error Message */}
          <p className="mb-6 text-red-700">{decodeURIComponent(reason)}</p>

          {/* Order ID (if available) */}
          {orderId && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 border border-red-200">
              <p className="text-sm text-red-600">Order ID</p>
              <p className="font-mono text-sm text-red-800">{orderId}</p>
            </div>
          )}

          {/* Back to Home Button */}
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailedPage;
