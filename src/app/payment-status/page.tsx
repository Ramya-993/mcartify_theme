"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosFetcher } from "@/utils/axios";
import { CheckCircle, AlertCircle, Clock, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { fetchCart } from "@/store/slices/cart";
import { AppDispatch } from "@/store/StoreProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PaymentStatusPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "failed" | "pending"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get payment information from URL parameters
  const orderId =
    searchParams.get("order_id") || searchParams.get("orderId") || "";
  const paymentId =
    searchParams.get("cf_payment_id") || searchParams.get("payment_id") || "";

  useEffect(() => {
    const handlePaymentReturn = async () => {
      if (!orderId) {
        setPaymentStatus("failed");
        setErrorMessage("Order ID not found");
        return;
      }

      // Check URL parameters to determine payment status
      const orderStatus = searchParams.get("order_status");
      const txStatus = searchParams.get("tx_status");
      const cfTxStatus = searchParams.get("transaction_status");
      const paymentStatus = searchParams.get("payment_status");

      console.log(
        "orderId123",
        orderId,
        "paymentId123",
        paymentId,
        "orderStatus",
        orderStatus,
        "txStatus",
        txStatus,
        "cfTxStatus",
        cfTxStatus,
        "paymentStatus",
        paymentStatus
      );

      // Determine payment status from URL parameters
      // Cashfree might use different parameter names, so check multiple variations
      if (
        orderStatus === "PAID" ||
        txStatus === "SUCCESS" ||
        cfTxStatus === "SUCCESS" ||
        paymentStatus === "SUCCESS" ||
        // If only order_id is present (common in sandbox), assume success
        (orderId && !orderStatus && !txStatus && !cfTxStatus && !paymentStatus)
      ) {
        setPaymentStatus("success");

        try {
          const token =
            localStorage.getItem("token") ||
            localStorage.getItem("guest_token") ||
            null;

          // Create order directly after successful payment
          // For Cashfree, use the order_id from URL (which is our internal payment order ID)
          const orderPayload = {
            addressId: parseInt(
              localStorage.getItem("selectedAddressId") || "0"
            ),
            shippingType: 1,
            paymentOrderId: orderId, // This should be the original payment order ID we created
          };

          console.log("Creating order with payload:", orderPayload);
          console.log("Token being used:", token);

          const orderResponse = await AxiosFetcher.post(
            "/stores/v2/order/create",
            orderPayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          console.log("Order API response:", orderResponse.data);

          if (orderResponse.data.Status) {
            console.log("Order created successfully");
            dispatch(fetchCart());
            router.replace(
              `/order-success?orderId=${orderResponse.data.OrderID}`
            );
          } else {
            console.error("Order creation failed:", orderResponse.data);
            setPaymentStatus("failed");
            setErrorMessage(
              orderResponse.data.Message || "Failed to create order"
            );
          }
        } catch (orderError: unknown) {
          const err = orderError as {
            response?: {
              data?: { Message?: string };
              status?: number;
            };
          };
          console.error("Error creating order:", orderError);
          console.error("Error response:", err?.response?.data);
          setPaymentStatus("failed");
          setErrorMessage(
            err?.response?.data?.Message ||
              `Error occurred while creating order (${
                err?.response?.status || "Unknown"
              })`
          );
        }
      } else if (
        orderStatus === "PENDING" ||
        txStatus === "PENDING" ||
        cfTxStatus === "PENDING" ||
        paymentStatus === "PENDING"
      ) {
        setPaymentStatus("pending");
      } else {
        setPaymentStatus("failed");
        setErrorMessage(searchParams.get("tx_msg") || "Payment failed");
      }
    };

    handlePaymentReturn();
  }, [orderId, router, dispatch, searchParams]);

  // Enhanced status configuration
  const statusConfig = {
    loading: {
      title: "Verifying Payment",
      message: "Please wait while we verify your payment...",
      icon: (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      ),
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-900/50",
    },
    success: {
      title: "Payment Successful!",
      message:
        "Your payment has been processed successfully. Redirecting to order confirmation...",
      icon: <CheckCircle className="h-16 w-16 text-green-600" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-900/50",
    },
    pending: {
      title: "Payment Pending",
      message:
        "Your payment is being processed. You will receive a confirmation shortly.",
      icon: <Clock className="h-16 w-16 text-yellow-600" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      borderColor: "border-yellow-200 dark:border-yellow-900/50",
    },
    failed: {
      title: "Payment Failed",
      message: errorMessage || "Your payment could not be processed.",
      icon: <AlertCircle className="h-16 w-16 text-red-600" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-900/50",
    },
  };

  const currentConfig = statusConfig[paymentStatus];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.3, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={paymentStatus}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            className={cn(
              "w-full max-w-md shadow-2xl border-2 backdrop-blur-sm bg-white/80 dark:bg-gray-950/80",
              currentConfig.borderColor
            )}
          >
            {/* Status Icon Section */}
            <div
              className={cn(
                "p-8 flex justify-center items-center border-b",
                currentConfig.bgColor
              )}
            >
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center"
              >
                {currentConfig.icon}
              </motion.div>
            </div>

            <CardContent className="p-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Status Message */}
                <motion.div
                  variants={itemVariants}
                  className="text-center space-y-3"
                >
                  <h1 className={cn("text-2xl font-bold", currentConfig.color)}>
                    {currentConfig.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentConfig.message}
                  </p>
                </motion.div>

                {/* Order Details */}
                {orderId && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Order ID
                      </span>
                      <span className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 px-2 py-1 rounded border">
                        {orderId}
                      </span>
                    </div>
                    {paymentId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Payment ID
                        </span>
                        <span className="font-mono text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 px-2 py-1 rounded border">
                          {paymentId}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="space-y-3">
                  {paymentStatus === "failed" && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => router.push("/checkout")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        size="lg"
                      >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Try Again
                      </Button>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => router.push("/")}
                      variant={
                        paymentStatus === "failed" ? "outline" : "default"
                      }
                      className={cn(
                        "w-full shadow-lg hover:shadow-xl transition-all duration-200",
                        paymentStatus === "failed"
                          ? "border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      )}
                      size="lg"
                    >
                      <Home className="mr-2 h-5 w-5" />
                      Back to Home
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentStatusPage;
