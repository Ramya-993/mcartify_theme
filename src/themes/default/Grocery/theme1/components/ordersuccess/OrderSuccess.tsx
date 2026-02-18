"use client";

import React from "react";
import Breadcrumb from "@/components/ui/breadcrumbs";
import { IOrder } from "@/types/orderResponse";
import { useOrderSuccess } from "@/themes/hooks/useOrderSuccess";
import Image from "next/image";

// Import ShadcnUI components
import { Button } from "@/components/ui/button";

interface OrderSuccessProps {
  orderData: IOrder;
}

const OrderSuccess = ({ orderData }: OrderSuccessProps) => {
  const {
    getFormattedDate,
    goToOrders,
    getAttributeDisplay,
    getPaymentMethodDisplay,
    loading,
    error,
  } = useOrderSuccess(orderData.orderId.toString(), orderData);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-(family-name:--font-primary)">
            Loading order details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600 font-(family-name:--font-primary)">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Calculate correct values using the proper formulas
  const calculatedSubTotal =
    orderData.originalPrice - (orderData.totalItemDiscount || 0);
  const calculatedFinalPrice =
    calculatedSubTotal -
    (orderData.promocodeDiscount || 0) +
    (orderData.vatAmount || 0) +
    (orderData.shippingCharges || 0);

  return (
    <div className="min-h-screen  py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb - Hidden on mobile, shown on desktop */}
        <section className="hidden lg:block mb-8">
          <Breadcrumb
            crumbItems={[
              { href: "/", label: "Home", isCurrent: false, isDisabled: false },
              {
                href: "/cart",
                label: "Cart",
                isCurrent: false,
                isDisabled: false,
              },
              {
                href: "/checkout",
                label: "Checkout",
                isCurrent: false,
                isDisabled: false,
              },
              {
                href: `/order-success?orderId=${orderData.orderId}`,
                label: "Order Complete",
                isCurrent: true,
                isDisabled: true,
              },
            ]}
          />
        </section>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Thank you message and billing address */}
          <div className="bg-white p-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-(family-name:--font-secondary) leading-tight">
              Thank you for your purchase!
            </h1>
            <p className="text-gray-600 mb-12 font-(family-name:--font-primary) text-lg leading-relaxed">
              Your order will be processed within 24 hours during working days.
              We will notify you by email once your order has been shipped.
            </p>

            {/* Billing Address */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-(family-name:--font-secondary)">
                Billing address
              </h2>

              <div className="space-y-4 text-base text-gray-700">
                <div className="flex">
                  <div className="w-20 flex-shrink-0">
                    <p className="font-bold text-gray-900 font-(family-name:--font-secondary)">
                      Name
                    </p>
                  </div>
                  <div>
                    <p className="font-(family-name:--font-primary)">
                      {orderData?.address?.firstName}{" "}
                      {orderData?.address?.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-20 flex-shrink-0">
                    <p className="font-bold text-gray-900 font-(family-name:--font-secondary)">
                      Address
                    </p>
                  </div>
                  <div>
                    <p className="font-(family-name:--font-primary)">
                      {orderData?.address?.streetAddress}
                      {orderData?.address?.addressLine2 &&
                        `, ${orderData?.address?.addressLine2}`}
                      , {orderData?.address?.city},{" "}
                      {orderData?.address?.stateName}{" "}
                      {orderData?.address?.postalCode}
                      {orderData?.address?.countryName &&
                        `, ${orderData?.address?.countryName}`}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-20 flex-shrink-0">
                    <p className="font-bold text-gray-900 font-(family-name:--font-secondary)">
                      Phone
                    </p>
                  </div>
                  <div>
                    <p className="font-(family-name:--font-primary)">
                      {orderData?.address?.phoneNumber}
                    </p>
                  </div>
                </div>

                {orderData?.address?.email && (
                  <div className="flex">
                    <div className="w-20 flex-shrink-0">
                      <p className="font-bold text-gray-900 font-(family-name:--font-secondary)">
                        Email
                      </p>
                    </div>
                    <div>
                      <p className="font-(family-name:--font-primary)">
                        {orderData?.address?.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Button
                onClick={goToOrders}
                className="bg-(color:--primary) hover:bg-(color:--primary-hover) font-(family-name:--font-secondary) text-white px-20 py-6 rounded-full font-medium text-lg"
              >
                Track Your Order
              </Button>
            </div>
          </div>

          {/* Right Column - Order Summary with Printer Effect */}
          <div className="printer-container max-w-md mx-auto lg:mx-0">
            {/* Printer Top */}
            <div className="printer-top"></div>

            {/* Paper Container */}
            <div className="paper-container">
              {/* Printer Bottom */}
              <div className="printer-bottom"></div>

              {/* Receipt Paper - Preserving Original Styles */}
              <div className="receipt-paper">
                <div className="bg-gray-100 shadow-none border-none overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4">
                    <h2 className="text-2xl font-bold font-(family-name:--font-secondary)">
                      Order Summary
                    </h2>
                    <hr className="border-gray-200 my-4" />
                  </div>

                  <div className="border-none shadow-none">
                    {/* Order Info - 3 column grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4 px-5 border-none shadow-none">
                      <div>
                        <p className="text-sm text-gray-500 font-(family-name:--font-secondary) mb-1">
                          Date
                        </p>
                        <p className="text-sm font-bold text-gray-900 font-(family-name:--font-secondary)">
                          {getFormattedDate(orderData.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-(family-name:--font-secondary) mb-1">
                          Order Number
                        </p>
                        <p className="text-sm font-bold text-gray-900 font-(family-name:--font-secondary)">
                          {orderData.orderId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-(family-name:--font-secondary) mb-1">
                          Payment Method
                        </p>
                        <p className="text-sm font-bold text-gray-900 font-(family-name:--font-secondary)">
                          {getPaymentMethodDisplay(orderData.paymentType)}
                        </p>
                      </div>
                    </div>

                    <div className="border-gray-800 pt-4 mt-6 flex items-center justify-around">
                      <span className="rounded-br-2xl rounded-tr-2xl w-5 h-10 bg-background" />
                      <hr className="flex-1 border-dashed border-gray-300" />
                      <span className="rounded-bl-2xl rounded-tl-2xl w-5 h-10 bg-background" />
                    </div>

                    {/* Product Items with Scroll */}
                    <div className="px-5 pt-6 mb-8">
                      <div className="max-h-80 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {orderData?.orderItems &&
                          orderData?.orderItems?.map((item, i) => (
                            <>
                              <div key={i} className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={54}
                                      height={54}
                                      className="rounded-xl object-cover"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center">
                                      <span className="text-gray-400 text-xs">
                                        No Image
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-bold text-gray-900 font-(family-name:--font-secondary) mb-2 leading-tight text-wrap">
                                    {item.name}
                                  </h3>
                                  {item.attributes &&
                                    item.attributes.length > 0 && (
                                      <p className="text-sm text-gray-500 font-(family-name:--font-primary) mb-1 text-wrap">
                                        Pack:{" "}
                                        {getAttributeDisplay(item.attributes)}
                                      </p>
                                    )}
                                  <p className="text-sm text-gray-500 font-(family-name:--font-primary) text-wrap">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                                    {item.finalItemPrice.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </>
                          ))}
                      </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="space-y-4 px-5 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-(family-name:--font-secondary)">
                          Sub Total
                        </span>
                        <span className="text-base text-gray-900 font-(family-name:--font-secondary)">
                          {calculatedSubTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-base font-(family-name:--font-secondary)">
                          Shipping
                        </span>
                        <span className="text-base text-gray-900 font-(family-name:--font-secondary)">
                          {orderData.shippingCharges > 0
                            ? `${orderData.shippingCharges.toFixed(2)}`
                            : "0"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-base font-(family-name:--font-secondary)">
                          Tax
                        </span>
                        <span className="text-base text-gray-900 font-(family-name:--font-secondary)">
                          {orderData.vatAmount > 0
                            ? orderData.vatAmount.toFixed(2)
                            : 0}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-6 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900 font-(family-name:--font-secondary)">
                            Order Total
                          </span>
                          <span className="text-2xl font-bold text-gray-900 font-(family-name:--font-secondary)">
                            {calculatedFinalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Bottom Triangular Zigzag */}
                  <div
                    className="h-6 bg-background"
                    style={{
                      clipPath:
                        "polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)",
                    }}
                  />
                </div>

                {/* Jagged Edge at Bottom */}
                <div className="jagged-edge"></div>
              </div>
            </div>

            {/* Additional Clippath Effect Outside Printer */}
            {/* <div
              className="h-6 bg-gray-100 shadow-none border-none overflow-hidden max-w-md mx-auto lg:mx-0"
              style={{
                transform: "rotateX(180deg)",
                clipPath:
                  "polygon(0% 100%, 3% 0%, 6% 100%, 9% 0%, 12% 100%, 15% 0%, 18% 100%, 21% 0%, 24% 100%, 27% 0%, 30% 100%, 33% 0%, 36% 100%, 39% 0%, 42% 100%, 45% 0%, 48% 100%, 51% 0%, 54% 100%, 57% 0%, 60% 100%, 63% 0%, 66% 100%, 69% 0%, 72% 100%, 75% 0%, 78% 100%, 81% 0%, 84% 100%, 87% 0%, 90% 100%, 93% 0%, 96% 100%, 99% 0%, 100% 100%)",
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
