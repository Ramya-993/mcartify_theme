"use client";

import DynamicOrderHistoryWrapper from "@/components/dynamic/DynamicOrderHistoryWrapper";
import { RootState } from "@/store/StoreProvider";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

function Orders() {
  const { isGuest } = useSelector((state: RootState) => state.user);
  if (isGuest) {
    return redirect("/");
  }
  return <DynamicOrderHistoryWrapper />;
}

export default Orders;
