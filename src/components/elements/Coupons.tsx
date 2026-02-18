"use client";

import useSearch from "@/hooks/useSearch";
import React, { useState } from "react";

const Coupons = () => {
  const [searchString, setSearchString] = useState("");
  // const matchingList = useSearch(searchString, [], "coupon_code");

  // console.log(matchedList)
  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          className="grow bg-gray-100 rounded-md border px-4 py-2"
          placeholder="Enter Coupon Code"
        />
        <button className="bg-emerald-600 text-white shrink-0 px-4 py-2 rounded-md">
          Apply
        </button>
      </div>
      <div className="mt-4">
        <p className="font-bold text-gray-600">Available Coupons</p>
        <div className="flex flex-col gap-2 mt-4">
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
          <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
            <p className="font-bold">🥦 Fresh Produce Deal - Save 100</p>
            <p className="mt-3 text-sm">
              Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy
              🍏🍊
            </p>
            <div className="flex justify-between mt-2 items-center">
              <p>
                Coupon Code:{" "}
                <span className="text-emerald-600 font-bold">FRESH100</span>
              </p>
              <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
