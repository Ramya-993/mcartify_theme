"use client";
import { IOrder } from "@/types/orderResponse";
import { AxiosFetcher } from "@/utils/axios";
import React, { use, useEffect, useState } from "react";
import { toastError } from "@/utils/toastConfig";
import DynamicOrderSuccessWrapper from "@/components/dynamic/DynamicOrderSuccessWrapper";

interface ISearchParams {
  searchParams: Promise<{ orderId: string }>;
}

function OrderSuccess({ searchParams }: ISearchParams) {
  const { orderId } = use(searchParams);
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

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
      } catch (e) {
        console.error("Error fetching order details:", e);
        let errorMessage = "Error occurred while fetching order details";
        
        // Type narrowing for axios error response
        if (e && typeof e === 'object' && 'response' in e) {
          const axiosError = e as { response?: { data?: { Message?: string }, error?: string } };
          errorMessage = axiosError.response?.data?.Message || axiosError.response?.error || errorMessage;
        }
        
        setError(errorMessage);
        toastError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-4 h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-4 h-screen flex flex-col justify-center items-center">
        <div className="text-red-500 text-xl font-semibold mb-4">
          {error || "Order details not available"}
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return <DynamicOrderSuccessWrapper orderData={orderData} />;
}

export default OrderSuccess;
