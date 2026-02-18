"use client";

import React from "react";
import MobileAndOTP from "./mobile_otp";
import Image from "next/image";
import LoginWithEmailAndPassword from "./email_pass";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import LoginWithMobileAndPassword from "./mobile_password";
import LoginWithEmailAndOtp from "./email_otp";

export const LoginTypes = {
  mobileAndOtp: "mobileAndOtp",
  emailAndPassword: "emailAndPassword",
  mobileAndPassword: "mobileAndPassword",
  emailAndOtp: "emailAndOtp",
};

const forms = {
  mobileAndOtp: <MobileAndOTP />,
  emailAndPassword: <LoginWithEmailAndPassword />,
  mobileAndPassword: <LoginWithMobileAndPassword />,
  emailAndOtp: <LoginWithEmailAndOtp />,
};

interface IloginTypes {
  storeImage: string;
  storeName: string;
}

const Login = ({ storeImage, storeName }: IloginTypes) => {
  const { store } = useSelector((state: RootState) => state.store);
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

  return (
    <div className="flex md:w-full md:flex-row flex-col divide-x divide-gray-300 rounded-xl bg-gray-100">
      <div className="bg-opacity-70 hidden md:flex shrink-0 flex-col items-center justify-center gap-4 bg-auto p-4">
        <Image
          src={storeImage || "https://picsum.photos/200/200"}
          className="rounded-full ring-2 ring-white"
          width={50}
          height={50}
          alt="user profile picture"
        />
        <p className="text-xl font-bold">{storeName}</p>
        <div>
          <div>Place orders more</div>
          <div>quickly & effortlessly</div>
          <div>each time.</div>
        </div>
      </div>
      <div className="min-h-36 grow">{forms[loginType]}</div>
    </div>
  );
};

export default Login;
