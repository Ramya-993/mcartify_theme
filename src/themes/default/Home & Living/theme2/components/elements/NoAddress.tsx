"use client";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import React from "react";
import { useDispatch } from "react-redux";
import AddAddress from "./AddAddress";
import Image from "next/image";

const NoAddress = () => {
  const dispatch = useDispatch();

  return (
    <div className="grid h-full place-items-center rounded-md bg-indigo-50">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="my-auto size-32"
          alt="no items"
          src={"/assets/no_address.png"}
          height={100}
          width={100}
        ></Image>
        <p className="text-center text-xs text-gray-600 font-(family-name:--font-primary)">
          No address found <br /> add address to Continue
        </p>
        <button
          onClick={() => {
            dispatch(
              updatePopModalData({
                content: <AddAddress />,
                footerShown: false,
                heading: "Add New Address",
              }),
            );
            dispatch(togglePopModal(true));
          }}
          className="mt-4 rounded-md bg-emerald-600 px-2 py-1 text-xs text-white font-(family-name:--font-primary)"
        >
          {" "}
          Add Address
        </button>
      </div>
    </div>
  );
};

export default NoAddress;
