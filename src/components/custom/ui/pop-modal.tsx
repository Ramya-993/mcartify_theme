"use client";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import { RootState } from "@/store/StoreProvider";
import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const PopModal = () => {
  const dispatch = useDispatch();
  const {
    isOpened,
    modalData: {
      content,
      headerShown,
      footerShown,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      heading,
      primaryActionName,
      secondaryActionName,
      width = "max-w-2xl",
    },
  } = useSelector((state: RootState) => state.modal);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Memoize the close modal function
  const closeModal = useCallback(() => {
    dispatch(togglePopModal(false));
  }, [dispatch]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpened) {
        closeModal();
      }
    };

    if (isOpened) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpened, closeModal]);

  // Handle click outside modal with Radix UI portal support
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpened) return;

      const target = event.target as Element;

      // Don't close if clicking on Radix UI portals (dropdown content, popovers, etc.)
      if (
        target.closest("[data-radix-popper-content-wrapper]") ||
        target.closest("[data-radix-select-content]") ||
        target.closest("[data-radix-dropdown-menu-content]") ||
        target.closest("[data-radix-popover-content]") ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="combobox"]') ||
        target.closest('[data-state="open"]') ||
        target.closest("[data-radix-portal]") ||
        // Additional Radix UI elements that might render outside modal
        target.closest("[data-radix-focus-scope]") ||
        target.closest("[data-radix-dismissable-layer]")
      ) {
        return;
      }

      // Only close if clicking on the overlay itself, not on modal content
      if (
        overlayRef.current &&
        modalRef.current &&
        event.target === overlayRef.current &&
        !modalRef.current.contains(target)
      ) {
        closeModal();
      }
    };

    if (isOpened) {
      // Use mousedown instead of click for better event handling
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpened, closeModal]);

  const handleCloseClick = () => {
    dispatch(
      updatePopModalData({
        isOpened: false,
        modalData: {
          content: "",
          headerShown: false,
          footerShown: false,
          onPrimaryButtonClick: () => {},
          onSecondaryButtonClick: () => {},
          heading: "Warning!",
          primaryActionName: "OK",
          secondaryActionName: "Cancel",
          width: "max-w-2xl",
        },
      })
    );
    dispatch(togglePopModal(false));
  };

  if (!isOpened) return null;

  return (
    <div
      ref={overlayRef}
      style={{ zIndex: 9999 }}
      className="bg-opacity-70 fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-stone-900/70 transition-colors"
      onClick={(e) => {
        // Only close if clicking on the overlay itself, not on modal content
        if (e.target === overlayRef.current) {
          closeModal();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`z-[9999] flex max-h-[80%] w-[90%] ${width} flex-col rounded-2xl border border-gray-300 bg-gray-100 px-4 border-box py-2 md:max-h-[80%] relative mx-auto`}
        onClick={(e) => {
          // Prevent event bubbling to overlay
          e.stopPropagation();
        }}
      >
        {headerShown && (
          <div className="flex items-center justify-between pb-2">
            <span className="text-md text-center font-bold">{heading}</span>
            <span
              className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              onClick={handleCloseClick}
            >
              close
            </span>
          </div>
        )}
        <div className="grow overflow-y-auto text-sm">{content}</div>
        {footerShown && (
          <div className="mt-2 flex justify-center gap-2 border-t border-gray-300 pt-2">
            <button
              onClick={onSecondaryButtonClick}
              className="rounded-md border border-solid border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              {secondaryActionName}
            </button>
            <button
              onClick={onPrimaryButtonClick}
              className="rounded-md border border-solid border-emerald-600 bg-emerald-600 px-3 text-sm font-bold text-white md:px-4 md:py-2 hover:bg-emerald-700 transition-colors"
            >
              {primaryActionName}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopModal;
