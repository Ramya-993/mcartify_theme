"use client";
import useTimer from "@/hooks/useTimer";
import { togglePopModal } from "@/store/slices/modal";
import { login, fetchCustomer } from "@/store/slices/user";
import { AppDispatch } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import { useRef, useEffect, KeyboardEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { fetchCart } from "@/store/slices/cart";

interface OTPInputProps {
  mobile?: string;
  email?: string;
  countryCode?: string;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const OTPInput = ({
  mobile,
  email,
  countryCode = "+91",
  setModalOpen,
}: OTPInputProps) => {
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
  const { time, timeInms, startTimer } = useTimer(60, () => {
    // Timer expired callback
  });
  const router = useRouter();

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
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs[index - 1]?.current
    ) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendOTP = () => {
    // Reset timer and request new OTP
    const mobileNumber = mobile?.slice(1);
    startTimer();
    const endpoint = email
      ? "/customer/send-otp/email"
      : "/customer/send-otp/phone";
    const payload = email ? { email } : { countryCode, phone: mobileNumber };

    AxiosFetcher.post(endpoint, payload)
      .then((res) => {
        if (res.data.Status) {
          toastSuccess("OTP resent successfully");
        } else {
          toastError(res?.data?.Message || "Failed to resend OTP");
        }
      })
      .catch((err) => {
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
    const mobileNumber = mobile?.slice(1);

    try {
      AxiosFetcher.post(
        `/customer/verify-otp/${email ? "email" : "phone"}`,
        email ? { email, otp } : { countryCode, phone: mobileNumber, otp },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )
        .then((res) => {
          if (res?.data?.Status) {
            localStorage.removeItem("guest_token");
            dispatch(login(res?.data?.Token));
            localStorage.setItem("token", res?.data?.Token);

            // Close modal using the passed setter if available
            if (setModalOpen) {
              setModalOpen(false);
            }
            // Also dispatch Redux action for backward compatibility
            dispatch(fetchCart());
            // Fetch customer details for non-guest users
            const token = localStorage.getItem("token");
            if (token) {
              dispatch(fetchCustomer());
            }
            dispatch(togglePopModal(false));
            toastSuccess("Login successful");
            router.push("/");
          } else {
            setIsSubmitting(false);
            toastError(res?.data?.Message || "Failed to login.");
          }
        })
        .catch((e) => {
          toastError(
            e?.response?.data?.Message || "Error occurred while verifying OTP"
          );
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
    <Card className="border-none shadow-none w-full max-w-md mx-auto">
      <CardContent className="space-y-6 px-4 py-6 sm:px-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm leading-relaxed">
            OTP has been sent to{" "}
            <span className="font-medium text-foreground block sm:inline mt-1 sm:mt-0">
              {mobile ? `${countryCode} ${mobile}` : email}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-center py-4 sm:py-6">
          <div className="grid grid-cols-6 gap-1.5 max-w-[280px] w-full sm:gap-3 sm:max-w-[350px]">
            {Array.from({ length: 6 }).map((_, index: number) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index] || ""}
                className={cn(
                  "aspect-square text-center font-semibold text-base border-2 rounded-lg",
                  "min-w-[40px] min-h-[40px] max-w-[50px] max-h-[50px]",
                  "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
                  "sm:min-w-[56px] sm:min-h-[56px] sm:text-lg",
                  "transition-all duration-200 ease-in-out",
                  "touch-manipulation",
                  "text-lg font-bold"
                )}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown(index, e as unknown as KeyboardEvent)
                }
                disabled={isSubmitting}
              />
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          {time ? (
            <div className="mb-4">
              <p className="font-mono text-lg font-semibold text-emerald-600">
                {time}
              </p>
            </div>
          ) : null}
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Don&apos;t receive code?</p>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-blue-500 disabled:text-muted-foreground underline font-medium"
              disabled={timeInms > 0 || isSubmitting}
              onClick={handleResendOTP}
            >
              Resend OTP
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={submitOtp}
            className="w-full rounded-full bg-(color:--primary) hover:bg-(color:--primary-hover) h-12 text-base font-medium cursor-pointer min-h-[48px] touch-manipulation"
            disabled={isSubmitting || otp.length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPInput;
