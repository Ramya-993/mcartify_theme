"use client";

import React from "react";

// Reusable coupon item component with proper font styling
interface CouponItemProps {
  title: string;
  description: string;
  code: string;
}

const CouponItem: React.FC<CouponItemProps> = ({
  title,
  description,
  code,
}) => {
  return (
    <div className="bg-indigo-100 border-dashed border-2 border-emerald-600 p-4 rounded-xl">
      <p className="font-bold font-(family-name:--font-secondary)">{title}</p>
      <p className="mt-3 text-sm font-(family-name:--font-primary)">
        {description}
      </p>
      <div className="flex justify-between mt-2 items-center">
        <p className="font-(family-name:--font-primary)">
          Coupon Code:{" "}
          <span className="text-emerald-600 font-bold font-(family-name:--font-price)">
            {code}
          </span>
        </p>
        <button className="border rounded-md px-2 py-1 border-emerald-700 bg-white text-emerald-600 font-(family-name:--font-primary)">
          Apply
        </button>
      </div>
    </div>
  );
};

const Coupons = () => {
  // Sample coupon data - in a real app this would come from an API
  const coupons = [
    {
      title: "🥦 Fresh Produce Deal - Save 100",
      description:
        "Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊",
      code: "FRESH100",
    },
    {
      title: "🥦 Fresh Produce Deal - Save 100",
      description:
        "Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊",
      code: "FRESH100",
    },
    {
      title: "🥦 Fresh Produce Deal - Save 100",
      description:
        "Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊",
      code: "FRESH100",
    },
    {
      title: "🥦 Fresh Produce Deal - Save 100",
      description:
        "Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊",
      code: "FRESH100",
    },
    {
      title: "🥦 Fresh Produce Deal - Save 100",
      description:
        "Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊",
      code: "FRESH100",
    },
  ];

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          className="grow bg-gray-100 rounded-md border px-4 py-2 font-(family-name:--font-primary)"
          placeholder="Enter Coupon Code"
        />
        <button className="bg-emerald-600 text-white shrink-0 px-4 py-2 rounded-md font-(family-name:--font-primary)">
          Apply
        </button>
      </div>
      <div className="mt-4">
        <p className="font-bold text-gray-600 font-(family-name:--font-secondary)">
          Available Coupons
        </p>
        <div className="flex flex-col gap-2 mt-4">
          {coupons.map((coupon, index) => (
            <CouponItem
              key={index}
              title={coupon.title}
              description={coupon.description}
              code={coupon.code}
            />
          ))}

          {/* Add a few more to match original count */}
          <CouponItem
            title="🥦 Fresh Produce Deal - Save 100"
            description="Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊"
            code="FRESH100"
          />
          <CouponItem
            title="🥦 Fresh Produce Deal - Save 100"
            description="Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊"
            code="FRESH100"
          />
          <CouponItem
            title="🥦 Fresh Produce Deal - Save 100"
            description="Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊"
            code="FRESH100"
          />
          <CouponItem
            title="🥦 Fresh Produce Deal - Save 100"
            description="Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊"
            code="FRESH100"
          />
          <CouponItem
            title="🥦 Fresh Produce Deal - Save 100"
            description="Get 10% OFF on all fruits & vegetables! Eat fresh, stay healthy  🍏🍊"
            code="FRESH100"
          />
        </div>
      </div>
    </div>
  );
};

export default Coupons;
