"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import NoAddress from "./NoAddress";
import { formatAddress } from "@/utils/addressFormatter";
import { changeAddressIndex, deleteAddress } from "@/store/slices/address";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import AddAddress from "./AddAddress";

const Address = () => {
  const dispatch = useDispatch();
  const { data: addresses, defaultAddressIndex } = useSelector(
    (state: RootState) => state.address,
  );

  return (
    <div className="md:px-4 px-2 flex flex-col">
      {/* <h1 className="text-base font-bold">Delivery Address</h1> */}
      {/* <p className="mt-4 font-bold">All Saved Addresses</p> */}
      <div className="mt-2 grid grid-cols-1 gap-4">
        {/* address card */}
        {addresses &&
          addresses.map(
            (
              address: {
                addressId: string;
                firstName: string;
                lastName: string;
                streetAddress: string;
                addressLine2: string;
                city: string;
                landmark: string;
                stateName: string;
                countryName: string;
                postalCode: string;
              },
              i: number,
            ) => {
              return (
                <div
                  onClick={() => {
                    dispatch(changeAddressIndex(i));
                  }}
                  key={address.addressId}
                  className="relative cursor-default rounded-xl border border-solid border-emerald-500 bg-slate-100"
                >
                  {i == defaultAddressIndex && (
                    <div className="absolute -top-[6px] -left-[6px]">
                      <span className="grid size-4 place-items-center rounded-full bg-emerald-600 text-white">
                        <span className="material-symbols-rounded !text-xs">
                          check
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-rounded !text-sm text-emerald-600">
                        pin_drop
                      </span>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">
                          {address.firstName + " " + (address?.lastName || "")}
                        </span>
                      </p>
                      <div className="absolute top-2 right-2 flex items-center *:cursor-pointer *:rounded *:p-1 *:transition">
                        {/* <div className="size-7 shrink-0 bg-gray-200 !text-sm text-emerald-600 hover:bg-gray-300">
                        <span className="material-symbols-rounded">
                          edit_location_alt
                        </span>
                      </div> */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            // @ts-ignore
                            dispatch(deleteAddress(address.addressId));
                          }}
                          className="ml-1 size-7 shrink-0 bg-red-100 !text-sm text-red-600 hover:bg-red-300"
                        >
                          <span className="material-symbols-rounded">
                            delete
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {formatAddress(address)}
                    </p>
                  </div>
                  {/* <hr /> */}
                  {/* <div className="grid grid-cols-2 gap-2 p-2">
                  <button className="flex items-center justify-center gap-1 rounded-lg bg-white py-2">
                    <span className="material-symbols-rounded !text-sm">
                      delete
                    </span>
                    <span className="">Delete</span>
                  </button>
                  <button className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-white">
                    <span className="material-symbols-rounded !text-sm">
                      edit_note
                    </span>
                    <span className="">Edit</span>
                  </button>
                </div> */}
                </div>
              );
            },
          )}
      </div>
      <button className="group flex items-end justify-end mt-2 text-sm text-right text-blue-500">
        <span
          className="group-hover:underline"
          onClick={() => {
            dispatch(
              updatePopModalData({
                content: <AddAddress />,
              }),
            );
            dispatch(togglePopModal(true));
          }}
        >
          Add Address
        </span>
        <span className="material-symbols-rounded">add_location_alt</span>
      </button>
    </div>
  );
};

export default Address;
