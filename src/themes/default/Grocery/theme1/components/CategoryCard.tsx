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
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <Link href={categoryLink} className="block">
      <motion.div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-(color:--primary-hover) hover:shadow-2xl shadow-(color:--primary-hover) transition-all duration-300 p-4 text-center group h-32 md:h-64 flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Rectangular Image Container */}
        <motion.div
          className="relative w-full flex-1 mb-3 overflow-hidden rounded-lg bg-gray-50"
          variants={imageVariants}
        >
          <Image
            src={image || "/images/default/placeholder.webp"}
            alt={`${name} category image`}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 150px, 200px"
            priority={false}
          />
        </motion.div>

        {/* Category Name */}
        <h3 className="text-sm md:text-base font-(family-name:--font-primary) font-medium text-gray-800 group-hover:text-(color:--primary-hover) transition-colors duration-200 leading-tight mt-auto">
          {name}
        </h3>
      </motion.div>
    </Link>
  );
};

const CategoryCard = memo(CategoryCardComponent);
CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
