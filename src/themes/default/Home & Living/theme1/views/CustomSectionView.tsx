"use client";
import React, { useRef, useState, useEffect } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CustomSectionViewProps, CustomSectionImage } from "../components/CustomSection";

const ResponsiveGridLayout = WidthProvider(Responsive);

const CustomSectionView: React.FC<CustomSectionViewProps> = ({
    title = "Curated Fashion Collections",
    sub_title = "Handpicked styles just for you",
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
                <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--background)" }}
                >
                    <div className="text-center">
                        <div
                            className="mb-2"
                            style={{
                                color: "var(--primary-foreground)",
                                fontSize: "var(--custom-section-error-icon-size)",
                            }}
                        >
                            📷
                        </div>
                        <p style={{ color: "var(--primary-foreground)", fontSize: "0.75rem" }}>
                            Image not available
                        </p>
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
                        borderRadius: "var(--custom-section-card-radius)",
                        width: "100%",
                        height: "100%",
                    }}
                    loading="lazy"
                    onError={() => handleImageError(String(image.id))}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {image.text && (
                    <Button
                        className="absolute left-1/2 -translate-x-1/2 bottom-6 rounded-none shadow-none text-base"
                        style={{
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            fontWeight: "var(--custom-section-button-font-weight)",
                            padding: `var(--custom-section-button-padding-y) var(--custom-section-button-padding-x)`,
                            borderRadius: 0,
                        }}
                    >
                        {image.text}
                    </Button>
                )}
            </>
        );
    };

    return (
        <section
            className="w-full"
            style={{
                paddingLeft: "var(--section-padding-y)",
                paddingRight: "var(--section-padding-y)",
            }}
        >
            {(title || sub_title) && (
                <div className="mb-6 text-center">
                    {title && (
                        <h2
                            style={{
                                color: "var(--primary-foreground)",
                                fontSize: "var(--custom-section-title-size)",
                                fontWeight: "var(--custom-section-title-weight)",
                                marginBottom: "var(--custom-section-title-margin-bottom)",
                            }}
                        >
                            {title}
                        </h2>
                    )}
                    {sub_title && (
                        <p
                            className="mx-auto"
                            style={{
                                color: "var(--secondary-foreground)",
                                fontSize: "var(--custom-section-subtitle-size)",
                                maxWidth: "var(--custom-section-subtitle-max-width)",
                            }}
                        >
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
                                className="group relative overflow-hidden"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "var(--custom-section-card-radius)",
                                    border: `1px solid var(--custom-section-card-border)`,
                                    backgroundColor: "var(--section-bg)",
                                    transition: "var(--custom-section-card-transition)",
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