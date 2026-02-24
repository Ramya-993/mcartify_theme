"use client";
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import CategoryCard from "../components/CategoryCard";
import type ICategory from "@/types/category";
import type { ExploreCategoriesViewProps } from "../components/ExploreCategories";

const ExploreCategoriesView: React.FC<ExploreCategoriesViewProps> = ({
    categories,
    error,
}) => {
    // Animation variants
    const containerVariants = useMemo(
        () => ({
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                },
            },
        }),
        []
    );

    const cardVariants = useMemo(
        () => ({
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    damping: 15,
                },
            },
        }),
        []
    );

    if (error) {
        return (
            <section
                className="py-(spacing:--section-padding-y) bg-(color:--section-bg)"
                aria-labelledby="explore-categories-error-title"
            >
                <div className="container mx-auto px-4">
                    <Card className="border-(color:--destructive)/50 shadow-(--card-error-shadow) rounded-(--card-radius)">
                        <CardHeader>
                            <CardTitle
                                id="explore-categories-error-title"
                                className="text-lg font-(weight:--card-title-weight) text-(color:--primary) md:text-2xl font-(family-name:--font-primary)"
                            >
                                Explore Our Fashion Collections
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-(color:--destructive) font-(family-name:--font-primary)">
                                Error loading categories. Please try again later.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        );
    }

    return (
        <section
            className="py-(spacing:--section-padding-y) bg-(color:--section-bg)"
            aria-labelledby="explore-categories-title"
        >
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={cardVariants}>
                        <Card className="border-0 bg-(color:--background)/50 shadow-none rounded-(--card-radius)">
                            <CardHeader className="flex-row items-center justify-between space-y-0 px-4 pt-4">
                                <CardTitle
                                    id="explore-categories-title"
                                    className="text-lg font-(weight:--card-title-weight) text-(color:--primary) md:text-2xl font-(family-name:--font-primary)"
                                >
                                    Explore Our Fashion Collections
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="px-4 pt-2">
                                <div className={`grid ${"grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"}`}>
                                    {categories.length === 0 ? (
                                        <div
                                            className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-(color:--primary)/20 bg-(color:--primary)/5 p-8 text-center"
                                            role="status"
                                            aria-live="polite"
                                        >
                                            <p className="mt-4 text-sm text-(color:--muted-foreground) font-(family-name:--font-primary)">
                                                No categories found
                                            </p>
                                        </div>
                                    ) : (
                                        categories.map((item: ICategory) => (
                                            <CategoryCard cardData={item} key={item.categoryId} />
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default ExploreCategoriesView;