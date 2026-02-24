"use client";
import React, { useRef, useState, useEffect } from "react";
import { WidthProvider, Responsive, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CustomSectionViewProps, CustomSectionImage } from "../components/CustomSection";

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomSectionView: React.FC<CustomSectionViewProps> = ({
    title,
    sub_title,
    images,
    layouts,
}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [rowHeight, setRowHeight] = useState(60);
    const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(
        new Set()
    );

    useEffect(() => {
        const updateRowHeight = () => {
            if (gridRef.current) {
                const containerWidth = gridRef.current.offsetWidth;
                const newRowHeight = (containerWidth / 12) * 0.5;
                setRowHeight(Math.max(newRowHeight, 40));
            }
        };

        updateRowHeight();
        window.addEventListener("resize", updateRowHeight);
        return () => window.removeEventListener("resize", updateRowHeight);
    }, []);

    const handleImageError = (imageId: string) => {
        setImageLoadErrors((prev) => new Set(prev).add(imageId));
    };

    const renderImageContent = (image: CustomSectionImage) => {
        const hasError = imageLoadErrors.has(String(image.id));
        const imageUrl = image.image_url || image.image;

        if (hasError) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-(color:--gray-200)">
                    <div className="text-center">
                        <div className="text-(color:--gray-400) text-(size:--4xl) mb-(spacing:--2)">📷</div>
                        <p className="text-(color:--gray-500) text-(size:--xs)">Image not available</p>
                    </div>
                </div>
            );
        }

        return (
            <>
                <Image
                    src={imageUrl}
                    alt={image.text || "Custom Section Image"}
                    fill
                    style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        width: "100%",
                        height: "100%",
                    }}
                    loading="lazy"
                    onError={() => handleImageError(String(image.id))}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {image.text && (
                    <Button
                        className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-(color:--white) text-(color:--neutral-900) font-(weight:--medium) px-(spacing:--8) py-(spacing:--3) rounded-(radius:--none) shadow-(--none) text-(size:--base)"
                        style={{ borderRadius: 0 }}
                    >
                        {image.text}
                    </Button>
                )}
            </>
        );
    };

    return (
        <section className="w-full px-(spacing:--4) md:px-(spacing:--6) lg:px-(spacing:--8)">
            {(title || sub_title) && (
                <div className="mb-(spacing:--6) text-center">
                    {title && (
                        <h2 className="text-(size:--2xl) md:text-(size:--3xl) font-(weight:--bold) mb-(spacing:--2) text-(color:--gray-900)">
                            {title}
                        </h2>
                    )}
                    {sub_title && (
                        <p className="text-(size:--lg) text-(color:--gray-600) max-w-2xl mx-auto">
                            {sub_title}
                        </p>
                    )}
                </div>
            )}

            <div ref={gridRef} className="w-full">
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 768, sm: 480 }}
                    cols={{ lg: 12, md: 8, sm: 4 }}
                    rowHeight={rowHeight}
                    isResizable={false}
                    isDraggable={false}
                    measureBeforeMount={false}
                    useCSSTransforms={true}
                    compactType={"vertical"}
                    margin={[0, 0]}
                >
                    {images.map((img: CustomSectionImage) => {
                        const imageContent = renderImageContent(img);
                        const link = (img as any).generatedLink;

                        const imageContainer = (
                            <div
                                key={img.id}
                                data-grid={img.layout}
                                className="group relative overflow-hidden rounded-(radius:--lg) border-(color:--gray-200) bg-(color:--gray-50) transition-all duration-300 hover:shadow-(--lg) hover:scale-[1.02]"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {imageContent}
                            </div>
                        );

                        return link ? (
                            <Link
                                key={img.id}
                                href={link}
                                className="block"
                                target={img.link_type === "url" ? "_blank" : "_self"}
                                rel={
                                    img.link_type === "url" ? "noopener noreferrer" : undefined
                                }
                            >
                                {imageContainer}
                            </Link>
                        ) : (
                            imageContainer
                        );
                    })}
                </ResponsiveGridLayout>
            </div>
        </section>
    );
};

export default CustomSectionView;