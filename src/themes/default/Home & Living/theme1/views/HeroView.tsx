"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { HeroProps } from "../components/Hero";

const HeroView: React.FC<HeroProps> = ({ config = {} }) => {
    const {
        title = "Step into Style",
        subtitle = "Discover the Latest Trends in Fashion",
        button_text = "Shop Now",
        button_link = "/shop",
        background_image = "/hero-bg.jpg",
    } = config;

    return (
        <section
            className="relative w-full overflow-hidden"
            style={{
                height: "var(--hero-height)",
                minHeight: "var(--hero-min-height)",
                maxHeight: "var(--hero-max-height)",
            }}
        >
            {/* Background Image */}
            <Image
                src={background_image}
                alt="Hero background"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
            />

            {/* Dark overlay for better text readability */}
            <div
                className="absolute inset-0 z-10"
                style={{ backgroundColor: "rgba(var(--background), var(--hero-overlay-opacity))" }}
            ></div>

            {/* Fade effect at the bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 z-20"
                style={{
                    height: "var(--hero-fade-height)",
                    background:
                        "linear-gradient(to top, var(--hero-fade-from) 0%, var(--hero-fade-via) 50%, var(--hero-fade-to) 100%)",
                }}
            ></div>

            {/* Content */}
            <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <h1
                        className="text-4xl md:text-6xl mb-6 leading-tight drop-shadow-lg"
                        style={{
                            color: "var(--primary-foreground)",
                            fontSize: "var(--hero-title-font-size)",
                            fontWeight: "var(--hero-title-weight)",
                            lineHeight: "var(--hero-title-line-height)",
                            textShadow: "var(--hero-text-shadow)",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
                        style={{
                            color: "var(--secondary-foreground)",
                            fontSize: "var(--hero-subtitle-font-size)",
                            lineHeight: "var(--hero-subtitle-line-height)",
                            textShadow: "var(--hero-text-shadow)",
                            margin: "0 auto 2rem auto",
                            maxWidth: "48rem",
                        }}
                    >
                        {subtitle}
                    </p>
                    {button_link && button_text && (
                        <Link
                            href={button_link}
                            className="inline-block transition-colors duration-200 shadow-lg hover:shadow-xl"
                            style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--primary-foreground)",
                                fontWeight: "var(--hero-button-font-weight)",
                                padding: "var(--section-padding-y) var(--hero-button-padding-x)",
                                borderRadius: "var(--hero-button-radius)",
                                fontSize: "var(--hero-button-font-size)",
                                textDecoration: "none",
                                boxShadow: "var(--hero-button-shadow)",
                            }}
                        >
                            {button_text}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroView;