"use client";
import useTimer from "@/hooks/useTimer";
import { togglePopModal } from "@/store/slices/modal";
import { login } from "@/store/slices/user";
import { AppDispatch } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import { useRef, useEffect, KeyboardEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const OTPInput = ({ mobile, email }: { mobile?: string; email?: string }) => {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { time, timeInms, startTimer } = useTimer(5, () => {
    // Timer expired callback
  });

  const handleInputChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    if (value && index < 5 && inputRefs[index + 1]?.current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent) => {
    if (event.key === "Backspace" && !otp[index] && index > 0 && inputRefs[index - 1]?.current) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendOTP = () => {
    // Reset timer and request new OTP
    startTimer();
    const endpoint = email ? "/customer/send-otp/email" : "/customer/send-otp/phone";
    const payload = email ? { email } : { countryCode: "+91", phone: mobile };
    
    AxiosFetcher.post(endpoint, payload)
      .then(res => {
        if (res.data.Status) {
          toastSuccess("OTP resent successfully");
        } else {
          toastError(res?.data?.Message || "Failed to resend OTP");
        }
      })
      .catch(err => {
        toastError(err?.response?.data?.Message || "Failed to resend OTP");
      });
  };

  useEffect(() => {
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
    // inputRefs is a stable array reference, so it's safe to exclude from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitOtp = () => {
    if (otp.length !== 6) {
      toastError("Please enter a complete 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("guest_token");
    
    try {
      AxiosFetcher.post(
        `/customer/verify-otp/${email ? "email" : "phone"}`,
        email
          ? { email, otp }
          : { countryCode: "+91", phone: mobile, otp },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )
        .then((res) => {
          if (res.data.Status) {
            localStorage.setItem("token", res.data.Token);
            dispatch(togglePopModal(false));
            dispatch(login(res.data.Token));
            toastSuccess('Login Successful');
          } else {
            toastError(res?.data?.Message || "Invalid OTP");
          }
        })
        .catch((e) => {
          toastError(e?.response?.data?.Message || "Error occurred while verifying OTP");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (e: unknown) {
      const error = e as { response?: { data?: { Message?: string } } };
      toastError(error?.response?.data?.Message || "Error occurred");
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="space-y-6 px-4 pt-4">
        <p className="text-muted-foreground">
          OTP has been sent to{" "}
          <span className="font-medium text-foreground">
            {mobile ? "+91 " + mobile : email}
          </span>
        </p>
        
        <div className="flex items-center justify-center gap-2 py-2">
          {Array.from({ length: 6 }).map((_, index: number) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ""}
              className={cn(
                "w-10 h-12 text-center font-semibold text-lg",
                "focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              )}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e as unknown as KeyboardEvent)}
              disabled={isSubmitting}
            />
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          {time ? <p>{time}</p> : null}
          <div className="flex items-center justify-center space-x-1 mt-1">
            <span>Don&apos;t receive code?</span>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-blue-500 disabled:text-muted-foreground"
              disabled={timeInms > 0 || isSubmitting}
              onClick={handleResendOTP}
            >
              Resend OTP
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={submitOtp}
          className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800"
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OTPInput;
