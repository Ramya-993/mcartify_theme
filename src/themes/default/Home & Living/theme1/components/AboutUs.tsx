"use client";
import { useAboutUs } from "@/themes/hooks/useAboutUs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import React, { memo, useMemo } from "react";

const HeaderSection = memo(({ 
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }), []);

  return (
    <div>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full py-(spacing:--about-header-padding-y) overflow-hidden"
        aria-labelledby="about-us-title"
      >
        <div className="absolute inset-0 z-0 w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt="About us banner image"
            fill
            className="object-cover w-full"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-(color:--about-header-overlay)/60" />
        </div>

        <div className="container relative z-10 mx-auto px-(spacing:--about-header-padding-x) text-center">
          <motion.div variants={itemVariants}>
            <h1 
              id="about-us-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-(weight:--about-heading-weight) text-(color:--about-heading-color) drop-shadow-(--about-heading-shadow) mb-(spacing:--about-heading-margin) font-(family-name:--font-secondary)"
            >
              {title}
            </h1>
          </motion.div>
        </div>
      </motion.section>
      <motion.div 
        className="container mx-auto px-(spacing:--about-content-padding-x) py-(spacing:--about-content-padding-y)"   
        variants={containerVariants}
      >
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-(color:--about-description-color) whitespace-pre-line max-w-3xl mx-auto leading-relaxed backdrop-blur-sm bg-(color:--about-description-bg)/30 p-(spacing:--about-description-padding) rounded-(radius:--about-description-radius) font-(family-name:--font-primary) shadow-(--about-description-shadow)"
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
});

HeaderSection.displayName = "HeaderSection";

const ContentSection = memo(({ 
  title,
  description,
  image,
  isRight,
  index,
}: {
  title: string;
  description: string;
  image: string;
  isRight: boolean;
  index: number;
}) => {
  // Animation variants
  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.15 
      }
    }
  }), [index]);

  const contentVariants = useMemo(() => ({
    hidden: { opacity: 0, x: isRight ? -20 : 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2 
      }
    }
  }), [isRight]);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={cardVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="py-(spacing:--about-section-padding-y)"
      aria-labelledby={`section-title-${index}`}
    >
      <div className="container mx-auto px-(spacing:--about-section-padding-x)">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Card
              className={cn(
                "flex flex-col overflow-hidden",
                isRight ? "md:flex-row-reverse" : "md:flex-row",
                "gap-0 transition-all duration-(ms:500) hover:shadow-(--about-card-hover-shadow) border border-solid border-(color:--about-card-border-color)/10 hover:border-(color:--about-card-border-hover-color)/30 rounded-(radius:--about-card-radius)"
              )}
            >
              <div className="md:w-1/2 relative aspect-video md:aspect-auto overflow-hidden group">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${title} illustration`}
                  fill
                  className="object-cover transition-transform duration-(ms:700) group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <CardContent className="md:w-1/2 flex flex-col justify-center p-(spacing:--about-card-padding-mobile) md:p-(spacing:--about-card-padding-desktop)">
                <motion.div
                  variants={contentVariants}
                  viewport={{ once: true }}
                >
                  <CardHeader className="p-0 mb-(spacing:--about-card-header-margin)">
                    <CardTitle 
                      id={`section-title-${index}`}
                      className="text-2xl md:text-3xl font-(weight:--about-card-title-weight) text-(color:--about-card-title-color) font-(family-name:--font-secondary)"
                    >
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <p className="text-(color:--about-card-text-color) whitespace-pre-line mb-(spacing:--about-card-text-margin) leading-relaxed font-(family-name:--font-primary)">
                    {description}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </HoverCardTrigger>
        </HoverCard>
      </div>
    </motion.section>
  );
});

ContentSection.displayName = "ContentSection";

const AboutUsSkeleton = memo(() => (
  <div className="space-y-(spacing:--about-skeleton-spacing) py-(spacing:--about-skeleton-padding-y)">
    {/* Header skeleton */}
    <div className="relative w-full py-(spacing:--about-header-padding-y) overflow-hidden bg-(color:--about-skeleton-header-bg)">
      <div className="container mx-auto px-(spacing:--about-header-padding-x) text-center">
        <Skeleton className="h-12 w-[300px] mx-auto mb-(spacing:--about-heading-margin) rounded-(radius:--about-skeleton-radius)" />
      </div>
    </div>
    <div className="container mx-auto px-(spacing:--about-content-padding-x)">
      <Skeleton className="h-[120px] w-full max-w-3xl mx-auto rounded-(radius:--about-description-radius)" />
    </div>

    {/* Content skeletons with animation */}
    {[0, 1].map((i) => (
      <motion.div 
        key={i} 
        className="container mx-auto px-(spacing:--about-section-padding-x) py-(spacing:--about-skeleton-section-padding-y)"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.2 }}
      >
        <Card className="flex flex-col md:flex-row overflow-hidden rounded-(radius:--about-card-radius) border border-solid border-(color:--about-skeleton-border)">
          <Skeleton className="w-full md:w-1/2 h-[300px] rounded-none" />
          <div className="w-full md:w-1/2 p-(spacing:--about-card-padding-mobile) md:p-(spacing:--about-card-padding-desktop)">
            <Skeleton className="h-8 w-3/4 mb-(spacing:--about-card-header-margin) rounded-(radius:--about-skeleton-radius)" />
            <Skeleton className="h-4 w-full mb-2 rounded-(radius:--about-skeleton-radius)" />
            <Skeleton className="h-4 w-full mb-2 rounded-(radius:--about-skeleton-radius)" />
            <Skeleton className="h-4 w-full mb-2 rounded-(radius:--about-skeleton-radius)" />
            <Skeleton className="h-4 w-full mb-2 rounded-(radius:--about-skeleton-radius)" />
            <Skeleton className="h-4 w-4/5 rounded-(radius:--about-skeleton-radius)" />
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
));

AboutUsSkeleton.displayName = "AboutUsSkeleton";

const ErrorState = memo(({ refetch }: { refetch: () => void }) => {
  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }), []);

  const iconVariants = useMemo(() => ({
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2,
      },
    },
  }), []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-(spacing:--about-error-padding-x) py-(spacing:--about-error-padding-y)"
    >
      <Card className="max-w-md mx-auto border border-solid border-(color:--destructive)/20 shadow-(--about-error-shadow) rounded-(radius:--about-error-radius)">
        <CardContent className="pt-8 pb-6 text-center">
          <motion.div
            variants={iconVariants}
            className="mx-auto mb-4 h-16 w-16 rounded-full bg-(color:--destructive)/10 flex items-center justify-center"
          >
            <AlertCircle className="h-8 w-8 text-(color:--destructive)" aria-hidden="true" />
          </motion.div>

          <h3 className="text-xl font-(weight:--about-error-title-weight) mb-2 font-(family-name:--font-secondary) text-(color:--about-error-title-color)">
            Unable to Load Content
          </h3>
          <p className="text-(color:--about-error-text-color) mb-6 font-(family-name:--font-primary)">
            We encountered a problem while loading the page content. Please try
            again.
          </p>

          <Button
            variant="outline"
            className="w-full border border-solid border-(color:--destructive)/30 hover:bg-(color:--destructive)/10 hover:text-(color:--destructive) transition-colors"
            onClick={refetch}
            aria-label="Retry loading content"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Retry Loading
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ErrorState.displayName = "ErrorState";

const EmptyState = memo(() => {
  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }), []);

  const iconVariants = useMemo(() => ({
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2,
      },
    },
  }), []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-(spacing:--about-empty-padding-x) py-(spacing:--about-empty-padding-y)"
    >
      <Card className="max-w-md mx-auto border border-solid border-(color:--primary)/20 shadow-(--about-empty-shadow) rounded-(radius:--about-empty-radius)">
        <CardContent className="pt-8 pb-6 text-center">
          <motion.div
            variants={iconVariants}
            className="mx-auto mb-4 h-16 w-16 rounded-full bg-(color:--primary)/10 flex items-center justify-center"
          >
            <AlertCircle className="h-8 w-8 text-(color:--primary)" aria-hidden="true" />
          </motion.div>

          <h3 className="text-xl font-(weight:--about-empty-title-weight) mb-2 font-(family-name:--font-secondary) text-(color:--about-empty-title-color)">
            Content Not Found
          </h3>
          <p className="text-(color:--about-empty-text-color) mb-6 font-(family-name:--font-primary)">
            The About Us content hasn&apos;t been added yet. Please check back later.
          </p>

          <Button
            variant="outline"
            className="w-full border border-solid border-(color:--primary)/30 hover:bg-(color:--primary)/10 hover:text-(color:--primary) transition-colors"
            onClick={() => window.location.href = '/'}
            aria-label="Return to home page"
          >
            Return to Home Page
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

EmptyState.displayName = "EmptyState";

const AboutUs = memo(() => {
  const { data, isLoading, error, refetch } = useAboutUs();

  if (isLoading) return <AboutUsSkeleton />;

  if (error || !data?.Status) {
    return <ErrorState refetch={refetch} />;
  }

  if (data?.AboutUs?.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-(color:--background) font-(family-name:--font-primary)">
      <main>
        {data.AboutUs.map((item, index) => {
          switch (item.type) {
            case "header":
              return (
                <HeaderSection
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.imageURL}
                />
              );
            case "contentLeft":
              return (
                <ContentSection
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.imageURL}
                  isRight={false}
                  index={index}
                />
              );
            case "contentRight":
              return (
                <ContentSection
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.imageURL}
                  isRight={true}
                  index={index}
                />
              );
            default:
              return null;
          }
        })}
      </main>
    </div>
  );
});

AboutUs.displayName = "AboutUs";

export default AboutUs;
