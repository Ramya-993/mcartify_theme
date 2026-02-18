import React from "react";
import Image from "next/image";

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  alt?: string;
}

// Trash/Delete Icon Component
export const TrashIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <Image
    src="/icons/trash.svg"
    alt="Delete"
    width={size}
    height={size}
    className={className}
    style={{ color }}
  />
);

// Credit Card Icon Component
export const CreditCardIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <Image
    src="/icons/card.svg"
    alt="Credit Card"
    width={size}
    height={size}
    className={className}
    style={{ color }}
  />
);

// Shopping Cart Icon Component
export const ShoppingCartIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <Image
    src="/icons/cart 1.svg"
    alt="Shopping Cart"
    width={size}
    height={size}
    className={className}
    style={{ color }}
  />
);

// Coupon Icon Component
export const CouponIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <Image
    src="/icons/coupon.svg"
    alt="Coupon"
    width={size}
    height={size}
    className={className}
    style={{ color }}
  />
);

// Plus Icon Component (keeping as SVG since no file provided)
export const PlusIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LocationIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <Image
    src="/icons/location.svg"
    alt="Location"
    width={size}
    height={size}
    className={className}
    style={{ color }}
  />
);

// Minus Icon Component (keeping as SVG since no file provided)
export const MinusIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Close/X Icon Component (keeping as SVG since no file provided)
export const CloseIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Package Icon Component (keeping as SVG since no file provided)
export const PackageIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8V7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 16V8H3V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 4V19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Alert Circle Icon Component (keeping as SVG since no file provided)
export const AlertCircleIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <path
      d="M12 8V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16H12.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Testimonials Icon Component
export const TestimonialsIcon: React.FC<IconProps> = ({
  className = "",
  size = 52,
  alt = "Testimonials",
}) => (
  <Image
    src="/icons/testimonials.svg"
    alt={alt}
    width={size}
    height={Math.round((size * 44) / 52)}
    className={className}
    priority={false}
  />
);

// Generic Icon Component for dynamic icon rendering
interface GenericIconProps extends IconProps {
  name:
    | "trash"
    | "plus"
    | "minus"
    | "cart"
    | "close"
    | "package"
    | "alert"
    | "creditcard";
}

export const Icon: React.FC<GenericIconProps> = ({ name, ...props }) => {
  switch (name) {
    case "trash":
      return <TrashIcon {...props} />;
    case "plus":
      return <PlusIcon {...props} />;
    case "minus":
      return <MinusIcon {...props} />;
    case "cart":
      return <ShoppingCartIcon {...props} />;
    case "close":
      return <CloseIcon {...props} />;
    case "package":
      return <PackageIcon {...props} />;
    case "alert":
      return <AlertCircleIcon {...props} />;
    case "creditcard":
      return <CreditCardIcon {...props} />;
    default:
      return null;
  }
};

// Export all icons as default
export default {
  Trash: TrashIcon,
  Plus: PlusIcon,
  Minus: MinusIcon,
  Cart: ShoppingCartIcon,
  Close: CloseIcon,
  Package: PackageIcon,
  Alert: AlertCircleIcon,
  CreditCard: CreditCardIcon,
  Testimonials: TestimonialsIcon,
  Icon,
};
