"use client";

import { AxiosFetcher } from "@/utils/axios";
import Image from "next/image";
import React, { useEffect, useState, use } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";

interface OrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  flatNo?: string;
  streetAddress: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  stateName: string;
  postalCode: string;
  countryName?: string;
  deliveryInstructions?: string;
}

interface OrderItemAttribute {
  id: number;
  name: string;
  unit: string | null;
  value: string;
  options: string[] | null;
  inputType: string;
  isRequired: number;
  isVariantDimension: number;
}

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  attributes: OrderItemAttribute[];
  basePrice: number;
  variantId: number;
  offerPrice: number;
  totalDiscount: number;
  finalItemPrice: number;
  totalBasePrice: number;
}

interface OrderData {
  orderId: number;
  customerId: number;
  shippingAddressId: number;
  billingAddressId: number;
  guestId: number | null;
  originalPrice: number;
  totalItemDiscount: number;
  promocodeId: number | null;
  promocodeDiscount: number;
  vatAmount: number;
  finalPrice: number;
  oStatus: number;
  createdAt: string;
  shippingType: number;
  shippingCharges: number;
  paymentType: number;
  subTotal: number;
  orderItems: OrderItem[];
  orderStatus: string;
  address: OrderAddress;
}

interface OrderDetailsProps {
  params: Promise<{ orderId: string }>;
}

const OrderDetails = ({ params }: OrderDetailsProps) => {
  const resolvedParams = use(params);
  const { orderId } = resolvedParams;
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(null);
  console.log("orderDetails132456", orderDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { isGuest } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      try {
        const response = await AxiosFetcher.get(`/stores/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrderDetails(response.data.Order);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // Helper functions
  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodDisplay = (paymentType: number) => {
    return paymentType === 1 ? "Cash On Delivery" : "Online Payment";
  };

  const getAttributeDisplay = (attributes: OrderItemAttribute[]) => {
    const metricValue = attributes.find(
      (attr) => attr.name === "MetricValue"
    )?.value;
    const metricType = attributes.find(
      (attr) => attr.name === "MetricType"
    )?.value;

    if (metricValue && metricType) {
      return `${metricValue} ${metricType}`;
    }

    return attributes
      .filter((attr) => attr.isVariantDimension === 1)
      .map((attr) => `${attr.value}${attr.unit ? ` ${attr.unit}` : ""}`)
      .join(", ");
  };

  const getStatusBadgeVariant = () => {
    const status = orderDetails?.orderStatus?.toLowerCase() || "";

    if (status.includes("delivered") || status.includes("completed")) {
      return "default";
    } else if (
      status.includes("shipped") ||
      status.includes("dispatched") ||
      status.includes("transit")
    ) {
      return "secondary";
    } else if (status.includes("processing") || status.includes("preparing")) {
      return "outline";
    } else {
      return "secondary";
    }
  };

  const getOrderStatus = () => {
    const status = orderDetails?.orderStatus?.toLowerCase() || "";
    if (status.includes("delivered") || status.includes("completed")) {
      return { step: 4, text: "Delivered" };
    } else if (
      status.includes("shipped") ||
      status.includes("dispatched") ||
      status.includes("out") ||
      status.includes("transit")
    ) {
      return { step: 3, text: "Out for Delivery" };
    } else if (status.includes("packed") || status.includes("preparing")) {
      return { step: 2, text: "Packed" };
    } else {
      return { step: 1, text: "Order Placed" };
    }
  };

  const goToHome = () => {
    return router.push("/");
  };

  const goToOrders = () => {
    return router.push("/profile/orders");
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Order not found</div>
        </div>
      </div>
    );
  }

  // Calculate correct values using the proper formulas
  const subTotal =
    (orderDetails.originalPrice || 0) - (orderDetails.totalItemDiscount || 0);
  const totalPriceAfterPromocode =
    subTotal - (orderDetails.promocodeDiscount || 0);
  const finalPrice = totalPriceAfterPromocode + (orderDetails.vatAmount || 0);
  const finalPriceWithShipping =
    finalPrice + (orderDetails.shippingCharges || 0);

  const currentStatus = getOrderStatus();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Order ID: {orderDetails.orderId}
            </h1>
          </div>
          <p className="text-gray-600 text-sm mb-6">Order information</p>

          {/* Status Indicator */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-yellow-600 font-medium">
                {currentStatus.text}
              </span>
            </div>
          </div>

          {/* Status Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {/* Order Placed */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  currentStatus.step >= 1
                    ? "bg-(color:--primary)"
                    : "bg-gray-200"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    currentStatus.step >= 1 ? "text-white" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  currentStatus.step >= 1
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Order Placed
              </span>
              <span
                className={`text-xs text-center ${
                  currentStatus.step >= 1
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Confirmed
              </span>
            </div>

            {/* Connecting Line */}
            <div
              className={`flex-1 h-1 mx-2 ${
                currentStatus.step >= 2 ? "bg-(color:--primary)" : "bg-gray-200"
              }`}
            ></div>

            {/* Packed */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  currentStatus.step >= 2
                    ? "bg-(color:--primary)"
                    : "bg-gray-200"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    currentStatus.step >= 2 ? "text-white" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  currentStatus.step >= 2
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Packed
              </span>
              <span
                className={`text-xs text-center ${
                  currentStatus.step >= 2
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                In Progress
              </span>
            </div>

            {/* Connecting Line */}
            <div
              className={`flex-1 h-1 mx-2 ${
                currentStatus.step >= 3 ? "bg-(color:--primary)" : "bg-gray-200"
              }`}
            ></div>

            {/* Out for Delivery */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  currentStatus.step >= 3
                    ? "bg-(color:--primary)"
                    : "bg-gray-200"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    currentStatus.step >= 3 ? "text-white" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  currentStatus.step >= 3
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Out for Delivery
              </span>
              <span
                className={`text-xs text-center ${
                  currentStatus.step >= 3
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Shipped
              </span>
            </div>

            {/* Connecting Line */}
            <div
              className={`flex-1 h-1 mx-2 ${
                currentStatus.step >= 4 ? "bg-(color:--primary)" : "bg-gray-200"
              }`}
            ></div>

            {/* Delivered */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  currentStatus.step >= 4
                    ? "bg-(color:--primary)0"
                    : "bg-gray-200"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    currentStatus.step >= 4 ? "text-white" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  currentStatus.step >= 4
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Delivered
              </span>
              <span
                className={`text-xs text-center ${
                  currentStatus.step >= 4
                    ? "text-(color:--primary)"
                    : "text-gray-400"
                }`}
              >
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {orderDetails.address.firstName}{" "}
                  {orderDetails.address.lastName}
                </p>
                <p>{orderDetails.address.streetAddress}</p>
                {orderDetails.address.addressLine2 && (
                  <p>{orderDetails.address.addressLine2}</p>
                )}
                <p>
                  {orderDetails.address.city}, {orderDetails.address.stateName}
                </p>
                <p>
                  {orderDetails.address.countryName}{" "}
                  {orderDetails.address.postalCode}
                </p>
                <p>Phone: {orderDetails.address.phoneNumber}</p>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Billing Address
              </h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {orderDetails.address.firstName}{" "}
                  {orderDetails.address.lastName}
                </p>
                <p>{orderDetails.address.streetAddress}</p>
                {orderDetails.address.addressLine2 && (
                  <p>{orderDetails.address.addressLine2}</p>
                )}
                <p>
                  {orderDetails.address.city}, {orderDetails.address.stateName}
                </p>
                <p>
                  {orderDetails.address.countryName}{" "}
                  {orderDetails.address.postalCode}
                </p>
                <p>Phone: {orderDetails.address.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order items</h3>
          </div>

          <div className="space-y-4">
            {orderDetails.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 text-2xl">🥭</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    ({getAttributeDisplay(item.attributes)})
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {item.finalItemPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">MRP Total</span>
              <span className="text-gray-900">
                {orderDetails.originalPrice.toFixed(2)}
              </span>
            </div>

            {orderDetails.totalItemDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product Discount</span>
                <span className="text-gray-900">
                  -{orderDetails.totalItemDiscount.toFixed(2)}
                </span>
              </div>
            )}

            {orderDetails.promocodeDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promocode Discount</span>
                <span className="text-green-600">
                  -{orderDetails.promocodeDiscount.toFixed(2)}
                </span>
              </div>
            )}

            {orderDetails.vatAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  {orderDetails.vatAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900">
                {orderDetails.shippingCharges > 0
                  ? `${orderDetails.shippingCharges.toFixed(2)}`
                  : "Free"}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-gray-900">
                  {finalPriceWithShipping.toFixed(2)}
                </span>
              </div>
              {(orderDetails.totalItemDiscount > 0 ||
                orderDetails.promocodeDiscount > 0) && (
                <p className="text-xs text-(color:--primary) text-right mt-1">
                  You Saved{" "}
                  {(
                    (orderDetails.totalItemDiscount || 0) +
                    (orderDetails.promocodeDiscount || 0)
                  ).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
