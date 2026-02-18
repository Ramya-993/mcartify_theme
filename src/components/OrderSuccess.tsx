"use client";

import React from "react";
import { IOrder } from "@/types/orderResponse";
import { useOrderSuccess } from "@/themes/hooks/useOrderSuccess";

interface OrderSuccessProps {
  orderData: IOrder;
}

const OrderSuccess = ({ orderData }: OrderSuccessProps) => {
  const { getFormattedDate, goToHome, goToOrders } = useOrderSuccess(
    orderData.orderId.toString()
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Order Confirmed</h1>
          <p className="text-gray-600 mt-1">
            Thank you. Your order has been received.
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Order number:{" "}
            <span className="font-semibold">{orderData.orderId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 border-t border-b py-4">
          <div className="">
            <p className="text-sm text-gray-500">Order number:</p>
            <p className="font-semibold text-gray-800">{orderData.orderId}</p>
          </div>

          <div className="">
            <p className="text-sm text-gray-500">Date:</p>
            <p className="font-semibold text-gray-800">
              {getFormattedDate(orderData.createdAt)}
            </p>
          </div>

          <div className="">
            <p className="text-sm text-gray-500">Total:</p>
            <p className="font-semibold text-green-600">
              {orderData.finalPrice}
            </p>
          </div>

          <div className="">
            <p className="text-sm text-gray-500">Payment method:</p>
            <p className="font-semibold text-gray-800">
              {orderData.paymentType == 1 ? "Cash On Delivery" : "UPI Payment"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
            Order Details
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderData?.orderItems &&
                  orderData?.orderItems?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Quantity:{" "}
                                <span className="font-medium">
                                  {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {item.finalItemPrice}
                        </td>
                      </tr>
                    );
                  })}
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-700">
                    Subtotal:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {orderData.subTotal}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700">
                    Total Discount:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    -{orderData.promocodeDiscount}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-700">
                    Payment Method:
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {orderData.paymentType == 1
                      ? "Cash On Delivery"
                      : "UPI Payment"}
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-3 text-sm font-bold text-green-800">
                    Final Price:
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-green-800">
                    {orderData.finalPrice}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
            Shipping Address
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-800 block mb-1">
              {orderData?.address?.firstName} {orderData?.address?.lastName}
            </span>
            <span className="text-gray-600 block mb-1">
              Phone: {orderData?.address?.phoneNumber}
            </span>
            <span className="text-gray-600 block">
              {orderData?.address?.flatNo}
            </span>
            {orderData?.address?.landmark && (
              <span className="text-gray-600 block">
                Landmark: {orderData?.address?.landmark}
              </span>
            )}
            <span className="text-gray-600 block">
              {orderData?.address?.streetAddress}
            </span>
            {orderData?.address?.addressLine2 && (
              <span className="text-gray-600 block">
                {orderData?.address?.addressLine2}
              </span>
            )}
            <span className="text-gray-600 block">
              {orderData?.address?.stateName}, {orderData?.address?.postalCode}
            </span>
            <span className="text-gray-600 block">
              {orderData?.address?.countryName}
            </span>
            {orderData?.address?.deliveryInstructions && (
              <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                <span className="text-sm font-medium text-gray-700 block">
                  Delivery Instructions:
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {orderData?.address?.deliveryInstructions}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            onClick={goToHome}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={goToOrders}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
