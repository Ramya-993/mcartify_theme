"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

export interface IDropdownData {
  lable: string;
  id: number;
  submenu?: IDropdownData[] | null;
  category?: number;
}

const DropdownMenu = ({
  data,
  children,
}: {
  data: IDropdownData[];
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<null | number>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleSubmenuMouseEnter = (id: number) => {
    setActiveSubmenu(id);
  };

  const handleSubmenuMouseLeave = () => {
    setActiveSubmenu(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      {children}

      {isOpen && (
        <div className="ring-opacity-5 absolute left-0 z-50 -mt-[1px] md:w-56 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none max-w-40 md:max-w-60">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {data.map((item) => (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/products?category=${item.id}`);
                }}
                key={item.id}
                className="relative flex justify-between px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100"
                role="menuitem"
                onMouseEnter={() => handleSubmenuMouseEnter(item.id)}
                onMouseLeave={handleSubmenuMouseLeave}
              >
                <span className="max-w-30 inline truncate">{item.lable}</span>
                
                {item.submenu && item.submenu.length > 0 && (
                  <>
                    <span className="material-symbols-rounded">
                      chevron_right
                    </span>
                    {activeSubmenu === item.id && (
                      <div className="ring-opacity-5 absolute top-0 left-full mt-0 w-40 md:w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-submenu"
                        >
                          {item.submenu.map((subItem: IDropdownData) => (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("first");
                                router.push(
                                  `/products?category=${subItem.category}&subcategory=${subItem.id}`,
                                );
                              }}
                              key={subItem.id}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              {subItem.lable}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
