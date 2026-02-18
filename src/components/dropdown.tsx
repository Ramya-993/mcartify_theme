// // components/Dropdown.tsx
// "use client";
// import { closeDropdown, toggleOpen } from "@/store/slices/dropdown";
// import { AppDispatch, RootState } from "@/store/StoreProvider";
// import React, { useRef, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";


// // import { RootState, AppDispatch } from "@/store/store";
// // import { setIsOpen, toggleOpen, closeDropdown } from "@/store/dropdownSlice";

// interface DropdownProps {
//   trigger: React.ReactNode;
//   children?: React.ReactNode;
// }

// const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
//   const { isOpen, position, content } = useSelector(
//     (state: RootState) => state.dropdown,
//   );
//   const dispatch = useDispatch<AppDispatch>();
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node) &&
//         isOpen
//       ) {
//         dispatch(closeDropdown());
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, dispatch]);

//   const dropdownStyle = {
//     position: "absolute" as "absolute",
//     background: "white",
//     border: "1px solid #ccc",
//     zIndex: 1000,
//     left: position?.x || 0,
//     top: position?.y || 0,
//   };

//   return (
//     <div
//       ref={dropdownRef}
//       style={{ position: "relative", display: "inline-block" }}
//     >
//       {React.cloneElement(trigger, {
//         onClick: () => dispatch(toggleOpen()),
//       })}
//       {isOpen && (
//         <div
//           style={
//             position
//               ? dropdownStyle
//               : {
//                   position: "absolute",
//                   background: "white",
//                   border: "1px solid #ccc",
//                   zIndex: 1000,
//                 }
//           }
//         >
//           {position ? content : children}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dropdown;
