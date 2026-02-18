"use client";

import DynamicOrderDetailsWrapper from "@/components/dynamic/DynamicOrderDetailsWrapper";

interface OrderDetailsPageProps {
  params: Promise<{ orderId: string }>; // Updated params type
}

const OrderDetailsPage = ({ params }: OrderDetailsPageProps) => {
  return <DynamicOrderDetailsWrapper params={params} />;
};

export default OrderDetailsPage;
