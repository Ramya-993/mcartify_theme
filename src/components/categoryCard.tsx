import ICategory from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryCard = ({ cardData }: { cardData: ICategory }) => {
  const { image, name, categoryId } = cardData;

  return (
    <Link href={`/products?category=${categoryId}`} className="swiper-slide">
      <div className="group hover:border-primary overflow-hidden rounded-xl border border-gray-200 bg-white py-2 transition-all duration-500 hover:border-emerald-600">
        <div className="flex items-center justify-center gap-10 py-4 transition-all duration-500">
          <Image
            width={50}
            height={50}
            src={image || "/images/default/placeholder.webp"}
            alt="image"
            className="h-28 w-auto rounded-lg transition-all duration-500 group-hover:scale-110"
          ></Image>
        </div>
        <h5 className="mt-2 text-center text-base font-semibold text-gray-800">
          {name}
        </h5>
      </div>
    </Link>
  );
};

export default CategoryCard;
