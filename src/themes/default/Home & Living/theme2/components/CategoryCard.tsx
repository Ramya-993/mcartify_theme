"use client";

import ICategory from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { useCategoryCard } from "@/themes/hooks/useCategoryCard";
import { motion } from "framer-motion";

interface CategoryCardProps {
  cardData: ICategory;
}

const CategoryCardComponent = ({ cardData }: CategoryCardProps) => {
  const { image, name } = cardData;
  const { categoryLink } = useCategoryCard(cardData);

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 15,
      },
    },
  };

  // Placeholder price (since ICategory has no price field)
  const price = "$50.00";

  return (
    <Link href={categoryLink} className="block">
      <motion.div
        className="relative hover:bg-(color:--primary)/10 rounded-3xl shadow-none hover:shadow-lg border-none overflow-visible transition-all duration-300 flex flex-col items-center w-full max-w-xs mx-auto min-h-[280px] pt-16 pb-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Floating Product Image - overlaps card top */}
        <motion.div
          className="absolute left-1/2 -top-16 -translate-x-1/2 z-10 flex justify-center items-center w-40 h-40"
          style={{ pointerEvents: "none" }}
          variants={imageVariants}
        >
          <Image
            src={image || "/images/default/placeholder.webp"}
            alt={`${name} category image`}
            className="object-contain drop-shadow-xl"
            width={160}
            height={160}
            priority={false}
          />
        </motion.div>

        {/* Category Name */}
        <h3 className="mt-24 text-lg font-semibold text-gray-900 text-center mb-1">
          {name}
        </h3>
        {/* Price */}
        <div className="text-xl font-bold text-gray-900 text-center mb-0">
          {price}
        </div>
      </motion.div>
    </Link>
  );
};

const CategoryCard = memo(CategoryCardComponent);
CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
