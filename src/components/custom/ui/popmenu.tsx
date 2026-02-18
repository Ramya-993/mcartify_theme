// Dropdown.jsx
import { useDropdown } from "@/hooks/useDropdown";
import React, { useState } from "react";
// import { useDropdown } from "./useDropdown";

interface IpopMenuItem {
  label: string;
  href: string;
  submenu: IpopMenuItem[];
}

const Dropdown = ({ items }: { items: IpopMenuItem[] }) => {
  const { isOpen, toggleDropdown, dropdownRef } = useDropdown();
  const [activeSubmenu, setActiveSubmenu] = useState<null | number>(null);

  const handleMouseEnter = (index: number) => {
    setActiveSubmenu(index);
  };

  const handleMouseLeave = () => {
    setActiveSubmenu(null);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        onClick={toggleDropdown}
      >
        Menu
        <span className="material-symbols-rounded">menu</span>
      </button>

      {isOpen && (
        <div
          className="ring-opacity-5 absolute right-0 mt-2 w-56 origin-top-right scale-100 transform rounded-md bg-white opacity-100 shadow-lg ring-1 ring-black transition-all duration-300 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {items.map((item: IpopMenuItem, index: number) => (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href={item.href || "#"}
                  className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex={-1}
                >
                  {item.label}
                </a>
                {item.submenu && activeSubmenu === index && (
                  <div className="ring-opacity-5 absolute top-0 left-full mt-0 ml-1 w-48 scale-100 transform rounded-md bg-white opacity-100 shadow-lg ring-1 ring-black transition-all duration-300">
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.label}
                          href={subItem.href || "#"}
                          className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex={-1}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

// Example usage in Root Layout or any component:
// import Dropdown from './Dropdown';

// const menuItems = [
//   { label: 'Profile', href: '/profile' },
//   {
//     label: 'Settings',
//     submenu: [
//       { label: 'Account', href: '/settings/account' },
//       { label: 'Preferences', href: '/settings/preferences' },
//     ],
//   },
//   { label: 'Logout', href: '/logout' },
// ];

// <Dropdown items={menuItems} />
