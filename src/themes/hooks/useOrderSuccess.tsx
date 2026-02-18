"use client";

import { IOrder } from "@/types/orderResponse";
import { formatDate } from "@/utils/dateFormatter";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AxiosFetcher } from "@/utils/axios";
import { toastError } from "@/utils/toastConfig";

export const useOrderSuccess = (
  orderId?: string,
  providedOrderData?: IOrder | null
) => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<IOrder | null>(
    providedOrderData || null
  );
  const [loading, setLoading] = useState<boolean>(!providedOrderData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if no order data is provided and orderId exists
    if (providedOrderData || !orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const guest_token =
          localStorage.getItem("token") ||
          localStorage.getItem("guest_token") ||
          "";

        const response = await AxiosFetcher.get(`/stores/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${guest_token}`,
          },
        });

        if (response.data?.Status) {
          setOrderData(response.data?.Order);
        } else {
          setError("Failed to load order details");
        }
      } catch (e: unknown) {
        console.error("Error fetching order details:", e);
        let errorMessage = "Error occurred while fetching order details";

        // Type narrowing for axios error response
        if (e && typeof e === "object" && "response" in e) {
          const axiosError = e as {
            response?: { data?: { Message?: string }; error?: string };
          };
          errorMessage =
            axiosError.response?.data?.Message ||
            axiosError.response?.error ||
            errorMessage;
        }

        setError(errorMessage);
        toastError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, providedOrderData]);

  // Function to format the order date
  const getFormattedDate = (dateString: string) => {
    return formatDate(dateString);
  };

  // Function to navigate back to home
  const goToHome = () => {
    router.push("/");
  };

  // Function to navigate to orders page
  const goToOrders = () => {
    router.push("/profile/orders");
  };

  // Function to get attribute display text
  const getAttributeDisplay = (
    attributes: { name: string; value: string }[]
  ) => {
    const metricType =
      attributes.find((attr) => attr.name === "MetricType")?.value || "";
    const metricValue =
      attributes.find((attr) => attr.name === "MetricValue")?.value || "";
    return metricValue && metricType ? `${metricValue} ${metricType}` : "";
  };

  // Function to get payment method display
  const getPaymentMethodDisplay = (paymentType: number) => {
    return paymentType === 1 ? "Cash On Delivery" : "Online Payment";
  };

  return {
    orderData,
    loading,
    error,
    getFormattedDate,
    goToHome,
    goToOrders,
    getAttributeDisplay,
    getPaymentMethodDisplay,
  };
};
