"use client";

import { fetchCart } from "@/store/slices/cart";
import { togglePopModal } from "@/store/slices/modal";
import { login } from "@/store/slices/user";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "./otp_screen";
import { toastError } from "@/utils/toastConfig";

// Shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface LoginWithEmailAndOtpProps {
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginWithEmailAndOtp = ({ setModalOpen }: LoginWithEmailAndOtpProps) => {
  const [authObject, setAuthObject] = useState({ email: "" });
  const [enterOtpShown, setEnterOtpShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  const { store } = useSelector((state: RootState) => state.store);

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(authObject.email)) {
      setErrorMsg("Please provide a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    AxiosFetcher.post("customer/send-otp/email", authObject)
      .then((res) => {
        if (res?.data?.Status) {
          setEnterOtpShown(true);
        } else {
          toastError(res?.data?.Message || "Error occurred");
        }
        setIsLoading(false);
      })
      .catch((e) => {
        toastError(e?.response?.data?.Message || "Error occurred");
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
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col gap-4 px-4 py-10">
        {enterOtpShown ? (
          <OTPInput email={authObject.email} setModalOpen={setModalOpen} />
        ) : (
          <>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-md font-semibold tracking-wider">
                Login with Email ID
              </CardTitle>
            </CardHeader>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-(color:--muted-foreground)" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="Enter your email"
                    maxLength={50}
                    value={authObject.email}
                    onChange={(e) => {
                      setAuthObject((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      if (errorMsg) setErrorMsg(null);
                    }}
                  />
                </div>
                {errorMsg && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">
                      {errorMsg}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                className="mt-4 w-full rounded-md bg-primary hover:bg-primary/50 cursor-pointer"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>
            </div>

            <p className="text-center text-xs text-(color:--muted-foreground) mt-4">
              By continuing you agree to our
              <br />
              <Link
                href="/privacy-policy"
                className="text-(color:--primary) underline hover:text-(color:--primary-hover)"
                onClick={() => {
                  if (setModalOpen) {
                    setModalOpen(false);
                  }
                  dispatch(togglePopModal(false));
                }}
              >
                Privacy Policy
              </Link>
              {" and "}
              <Link
                href="/terms-and-conditions"
                className="text-(color:--primary) underline hover:text-(color:--primary-hover)"
                onClick={() => {
                  if (setModalOpen) {
                    setModalOpen(false);
                  }
                  dispatch(togglePopModal(false));
                }}
              >
                Terms of Use
              </Link>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginWithEmailAndOtp;
