"use client";

import Link from "next/link";
import React, { useState } from "react";
import OTPInput from "./otp_screen";
import { AxiosFetcher } from "@/utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { login } from "@/store/slices/user";
import { togglePopModal } from "@/store/slices/modal";
import { fetchCart } from "@/store/slices/cart";
import { toastError } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone } from "lucide-react";

const MobileAndOTP = () => {
  const [mobile, setMobile] = useState("");
  const [enterOtpShown, setEnterOtpShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  const { store } = useSelector((state: RootState) => state.store);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 10) {
      setMobile((state) => state.slice(0, 10));
    } else {
      const filteredValue = e.target.value.replace(/\D/g, "");
      setMobile(filteredValue);
    }
    // Clear error message when user starts typing again
    if (errorMsg) setErrorMsg(null);
  };

  const sendOTP = () => {
    if (mobile.length !== 10) {
      setErrorMsg("Mobile number should be 10 digits");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setErrorMsg(
        "Mobile number should be exactly 10 digits and contain only numbers."
      );
      return;
    }

    setIsLoading(true);
    AxiosFetcher.post("customer/send-otp/phone", {
      countryCode: "+91",
      phone: mobile,
    })
      .then((res) => {
        if (res.data.Status) {
          setEnterOtpShown(true);
        } else {
          toastError(res.data.Message || "Error occurred while login");
        }
      })
      .catch((err) => {
        toastError(
          err?.response?.data?.Message ||
            "Error occurred while sending OTP"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const continueAsGuest = () => {
    const guest_token = localStorage.getItem("guest_token");
    if (guest_token) {
      dispatch(login(guest_token));
    } else {
      dispatch(fetchCart()).then(() => {
        const guest_token = localStorage.getItem("guest_token");
        dispatch(login(guest_token));
      });
    }
    dispatch(togglePopModal(false));
  };

  return (
    <div className="auth-form space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Groceries at your doorstep, in on time!</h1>
      
      {enterOtpShown ? (
        <OTPInput mobile={mobile} />
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Phone className="h-4 w-4" />
              </div>
              <div className="absolute left-9 top-1/2 -translate-y-1/2 text-foreground font-medium">
                +91
              </div>
              <Input
                onChange={handleMobileChange}
                type="tel"
                value={mobile}
                className="pl-16 rounded-full"
                placeholder="Enter Phone Number"
                inputMode="numeric"
                pattern="[0-9]{10}"
                title="Please enter a 10-digit mobile number"
              />
            </div>
            
            {errorMsg && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <Button 
            onClick={sendOTP}
            className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800"
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Continue"}
          </Button>
          
          <div className="flex justify-center">
            {store?.loginTypes?.[0]?.allowGuest ? (
              <Button
                variant="link"
                className="p-0 h-auto text-blue-500"
                onClick={continueAsGuest}
              >
                Continue as Guest
              </Button>
            ) : null}
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            By Continuing you agree to our
            <br />
            <Link href={"/privacy-policy"} className="text-blue-500 underline">
              Privacy Policy and Terms of Use
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAndOTP;
