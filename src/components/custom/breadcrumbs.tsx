import Link from "next/link";
import React from "react";

interface ICrumbItems {
  isCurrent: boolean;
  isDisabled: boolean;
  label: string;
  href: string;
}

const Breadcrumb = ({
  crumbItems,
  className,
  ...rest
}: {
  crumbItems: ICrumbItems[];
  className?: string;
  rest?: any;
}) => {
  return (
    crumbItems && (
      <nav
        className={`flex md:pt-4 pt-2 ${className}`}
        aria-label="Breadcrumb"
        {...rest}
      >
        <ol className="scroll-none inline-flex items-center overflow-x-auto pb-3 rtl:space-x-reverse">
          {crumbItems.map((crumb, i) => {
            return (
              <li
                key={i}
                className="ms-2 inline-flex items-center min-w-0 flex-shrink-0"
              >
                <span
                  className={`font-bold truncate max-w-[150px] md:max-w-[200px] ${
                    crumb.isCurrent
                      ? "text-gray-400"
                      : "text-gray-600 hover:text-emerald-600"
                  }`}
                  title={crumb.label}
                >
                  {crumb.isDisabled ? (
                    <span className="truncate block">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="truncate block">
                      {crumb.label}
                    </Link>
                  )}
                </span>
                {i < crumbItems.length - 1 && (
                  <span className="material-symbols-rounded ms-1 !text-[10px] flex-shrink-0">
                    chevron_right
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    )
  );
};

export default Breadcrumb;
