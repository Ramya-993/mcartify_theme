"use client";

import React from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/StoreProvider";
import { togglePopModal } from "@/store/slices/modal";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

// Import existing auth components
import MobileAndOTP from "./mobile_otp";
import LoginWithEmailAndPassword from "./email_pass";
import LoginWithMobileAndPassword from "./mobile_password";
import LoginWithEmailAndOtp from "./email_otp";

export const LoginTypes = {
  mobileAndOtp: "mobileAndOtp",
  emailAndPassword: "emailAndPassword",
  mobileAndPassword: "mobileAndPassword",
  emailAndOtp: "emailAndOtp",
};

interface LoginModalProps {
  storeImage: string;
  storeName: string;
  // Optional prop to use as regular component instead of modal
  asComponent?: boolean;
  // Optional close function for external modal control
  onClose?: () => void;
}

const LoginModal = ({
  storeImage,
  storeName,
  asComponent = false,
  onClose,
}: LoginModalProps) => {
  const { store } = useSelector((state: RootState) => state.store);
  const dispatch = useDispatch<AppDispatch>();

  // Determine the login type based on store configuration
  const loginType:
    | "mobileAndOtp"
    | "emailAndPassword"
    | "mobileAndPassword"
    | "emailAndOtp" = store?.loginTypes?.[0]?.emailPassword
    ? "emailAndPassword"
    : store?.loginTypes?.[0]?.phonePassword
    ? "mobileAndPassword"
    : store?.loginTypes?.[0]?.emailOtp
    ? "emailAndOtp"
    : "mobileAndOtp";

  const [open, setOpen] = React.useState(false);

  // Function to close popup modal (for component mode)
  const closePopupModal = () => {
    if (onClose) {
      onClose(); // Use external close function if provided
    } else {
      dispatch(togglePopModal(false)); // Fallback to popup modal system
    }
  };

  // Create forms with setOpen function for modal mode
  const createModalForms = () => ({
    mobileAndOtp: <MobileAndOTP setModalOpen={setOpen} />,
    emailAndPassword: <LoginWithEmailAndPassword setModalOpen={setOpen} />,
    mobileAndPassword: <LoginWithMobileAndPassword setModalOpen={setOpen} />,
    emailAndOtp: <LoginWithEmailAndOtp setModalOpen={setOpen} />,
  });

  // Create forms with popup modal close function for component mode
  const createComponentForms = () => ({
    mobileAndOtp: <MobileAndOTP setModalOpen={closePopupModal} />,
    emailAndPassword: (
      <LoginWithEmailAndPassword setModalOpen={closePopupModal} />
    ),
    mobileAndPassword: (
      <LoginWithMobileAndPassword setModalOpen={closePopupModal} />
    ),
    emailAndOtp: <LoginWithEmailAndOtp setModalOpen={closePopupModal} />,
  });

  // Unified login content layout
  const LoginContent = ({ isModal = false }: { isModal?: boolean }) => (
    <div className="flex w-full md:flex-row flex-col divide-x divide-gray-300 rounded-xl bg-gray-100 min-h-[400px]">
      <div className="bg-opacity-70 hidden md:flex shrink-0 flex-col items-center justify-center gap-4 bg-auto p-6 md:w-80 lg:w-96">
        <Image
          src={storeImage || "https://picsum.photos/200/200"}
          className="rounded-full ring-2 ring-white"
          width={60}
          height={60}
          alt="user profile picture"
        />
        <p className="text-xl font-bold text-center">{storeName}</p>
        <div className="text-center text-sm text-muted-foreground">
          <div>Place orders more</div>
          <div>quickly & effortlessly</div>
          <div>each time.</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-2">
        {isModal
          ? createModalForms()[loginType]
          : createComponentForms()[loginType]}
      </div>
    </div>
  );

  // If used as component (like original Login), return the content directly
  if (asComponent) {
    return <LoginContent isModal={false} />;
  }

  // If used as modal (default behavior), wrap in Dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r cursor-pointer from-primary to-primary hover:from-primary-hover hover:to-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-4 h-10 font-semibold text-sm">
          <User className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-3xl lg:max-w-4xl p-0 overflow-hidden max-h-[90vh]">
        <LoginContent isModal={true} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
