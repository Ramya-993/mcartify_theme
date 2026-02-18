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

  return (
    <Link href={categoryLink} className="block">
      <motion.div
        className="bg-white rounded-xl shadow-none hover:shadow-lg border-none overflow-hidden transition-all duration-300 flex flex-col items-center w-full max-w-md mx-auto min-h-[500px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Image fills the top, rounded top corners */}
        <motion.div
          className="relative w-full h-96 md:h-[440px] overflow-hidden rounded-t-xl bg-gray-50"
          variants={imageVariants}
        >
          <Image
            src={image || "/images/default/placeholder.webp"}
            alt={`${name} category image`}
            className="object-cover rounded-xl"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </motion.div>

        {/* Category Name immediately below image */}
        <h3 className="mt-4 mb-4 text-lg md:text-xl font-bold text-gray-900 text-center tracking-tight">
          {name}
        </h3>
      </motion.div>
    </Link>
  );
};

const CategoryCard = memo(CategoryCardComponent);
CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
