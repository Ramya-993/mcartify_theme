"use client";

import { fetchAllOrders } from "@/store/slices/orders";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { Order } from "@/types/order-response";
import { formatDate } from "@/utils/dateFormatter";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function OrderHistory() {
  const { data: orders, pagination } = useSelector(
    (state: RootState) => state.orders
  );
  const [page, setPage] = useState(1);
  const [size] = useState(10); // Using fixed page size, removed setSize as it's not used
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllOrders({ page, size }));
  }, [page, size, dispatch]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination || pagination.totalPages <= 1) return [];

    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const pageNumbers = [];

    // Show up to 5 page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Mobile Card Component for individual orders
  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="shadow-sm mb-2 bg-gray-50/50">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header with Order ID and Status */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900 font-(family-name:--font-primary) text-xs">
                Order #{order.orderId}
              </h4>
              <p className="text-xs text-gray-500 font-(family-name:--font-primary) mt-0.5">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 font-(family-name:--font-primary) text-xs px-2 py-1"
            >
              {order?.orderStatus}
            </Badge>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 font-(family-name:--font-primary)">
                Items:
              </span>
              <span className="font-medium text-gray-900 font-(family-name:--font-primary)">
                {order.orderItemsCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-(family-name:--font-primary)">
                Payment:
              </span>
              <span className="font-medium text-gray-900 font-(family-name:--font-primary)">
                {order.paymentType === 1 ? "Online" : "COD"}
              </span>
            </div>
          </div>

          {/* Price Details */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-(family-name:--font-primary)">
                Original:
              </span>
              <span className="text-gray-700 font-(family-name:--font-price)">
                ₹{order.originalPrice.toFixed(2)}
              </span>
            </div>
            {order.totalItemDiscount > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-(family-name:--font-primary)">
                  Discount:
                </span>
                <span className="text-green-600 font-(family-name:--font-price)">
                  -₹{order.totalItemDiscount.toFixed(2)}
                </span>
              </div>
            )}
            {order.shippingCharges > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-(family-name:--font-primary)">
                  Shipping:
                </span>
                <span className="text-gray-700 font-(family-name:--font-price)">
                  ₹{order.shippingCharges.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-gray-900 font-semibold font-(family-name:--font-primary)">
                Total:
              </span>
              <span className="font-semibold text-gray-900 font-(family-name:--font-price) text-sm">
                ₹{order.finalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <Button
              variant="outline"
              asChild
              className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 h-8"
              size="sm"
            >
              <Link href={`/profile/orders/${order.orderId}`}>
                <span className="font-(family-name:--font-primary) text-xs">
                  View Details →
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-white">
        <CardTitle className="text-emerald-800 text-xl font-bold font-(family-name:--font-secondary)">
          My Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!orders || orders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700 font-(family-name:--font-secondary)">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 font-(family-name:--font-primary)">
                  You haven&apos;t placed any orders yet. Start shopping to see
                  your order history here.
                </p>
              </div>
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-(family-name:--font-primary)"
              >
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout - Hidden on lg and above */}
            <div className="block lg:hidden p-4 space-y-0">
              {orders.map((order: Order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>

            {/* Desktop Table Layout - Hidden on mobile */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 font-(family-name:--font-secondary)">
                      Order ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 font-(family-name:--font-secondary)">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 font-(family-name:--font-secondary)">
                      Total
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 font-(family-name:--font-secondary)">
                      Status
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 font-(family-name:--font-secondary)">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order) => (
                    <TableRow
                      key={order.orderId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 font-(family-name:--font-primary)">
                        #{order.orderId}
                      </TableCell>
                      <TableCell className="text-gray-700 font-(family-name:--font-primary)">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-gray-700 font-semibold font-(family-name:--font-price)">
                        ₹{order.finalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 font-(family-name:--font-primary)"
                        >
                          {order?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="link"
                          asChild
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <Link href={`/profile/orders/${order.orderId}`}>
                            <span className="font-(family-name:--font-primary)">
                              View Details →
                            </span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 font-(family-name:--font-primary) text-center sm:text-left">
                    Showing page {pagination.page} of {pagination.totalPages} (
                    {pagination.totalOrdersCount} total orders)
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(pagination.page - 1)}
                          className={
                            pagination.page === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={pagination.page === pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(pagination.page + 1)}
                          className={
                            !pagination.nextPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default OrderHistory;
