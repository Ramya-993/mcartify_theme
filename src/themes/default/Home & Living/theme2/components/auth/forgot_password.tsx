"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosFetcher } from "@/utils/axios";
// toastError and toastSuccess imports removed as they're not used in this component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { PhoneInput } from "@/components/custom-components/phone-input";
import {
  Country,
  formatPhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import useTimer from "@/hooks/useTimer";
import ResetPassword from "./reset_password";

// Schema for email forgot password
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

// Schema for mobile forgot password
const mobileSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number format" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type MobileFormValues = z.infer<typeof mobileSchema>;

interface ForgotPasswordProps {
  mode: "email" | "mobile";
  onBack: () => void;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

// OTP Verification Component for Mobile Forgot Password
const MobileOTPVerification = ({
  mobile,
  countryCode,
  onBack,
  onVerified,
}: {
  mobile: string;
  countryCode: string;
  onBack: () => void;
  onVerified: (token: string) => void;
}) => {
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { time, timeInms, startTimer } = useTimer(60, () => {
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
    startTimer();
    setErrorMsg(null);

    AxiosFetcher.post("/customer/send-otp/phone", {
      countryCode,
      phone: mobile,
    })
      .then((res) => {
        if (res.data.Status) {
          // OTP resent successfully - show success message if needed
        } else {
          setErrorMsg(res?.data?.Message || "Failed to resend OTP");
        }
      })
      .catch((err) => {
        setErrorMsg(err?.response?.data?.Message || "Failed to resend OTP");
      });
  };

  const submitOtp = () => {
    if (otp.length !== 6) {
      setErrorMsg("Please enter a complete 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    AxiosFetcher.post("/customer/forgotPassword/phone", {
      countryCode,
      phone: mobile,
      otp: parseInt(otp),
    })
      .then((res) => {
        if (res?.data?.Status) {
          // Pass the token to the parent component
          onVerified(res?.data?.Token || "");
        } else {
          setErrorMsg(res?.data?.Message || "Invalid OTP. Please try again.");
        }
      })
      .catch((e) => {
        setErrorMsg(
          e?.response?.data?.Message || "Error occurred while verifying OTP"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col gap-4 px-4 py-6">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg font-semibold">Verify OTP</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            OTP has been sent to{" "}
            <span className="font-medium text-foreground">
              {countryCode} {mobile}
            </span>
          </p>
        </CardHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          {Array.from({ length: 6 }).map((_, index: number) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ""}
              className={cn(
                "w-12 h-12 text-center font-semibold text-lg border-2",
                "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
                "sm:w-14 sm:h-14"
              )}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) =>
                handleKeyDown(index, e as unknown as KeyboardEvent)
              }
              disabled={isSubmitting}
            />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          {time ? <p className="font-mono text-base">{time}</p> : null}
          <div className="flex items-center justify-center space-x-1">
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

        {errorMsg && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={submitOtp}
          className="w-full rounded-md bg-primary hover:bg-primary/90"
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>
      </CardContent>
    </Card>
  );
};

const ForgotPassword = ({
  mode,
  onBack,
  setModalOpen,
}: ForgotPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [resetToken, setResetToken] = useState<string>("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState<Country>("IN");

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Mobile form
  const mobileForm = useForm<MobileFormValues>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { phone: "" },
  });

  const handlePhoneChange = (value: string) => {
    if (value) {
      const nationalFormattedNumber = formatPhoneNumber(value);
      const formattedPhoneNumber =
        nationalFormattedNumber?.replace(/\D/g, "") || "";
      setMobile(formattedPhoneNumber);
    }
  };

  const handleCountryChange = (newCountry: Country) => {
    setCountry(newCountry);
  };

  const onEmailSubmit = (data: EmailFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    AxiosFetcher.post("/customer/forgotPassword", { email: data.email })
      .then((res) => {
        if (res?.data?.Status) {
          setSuccessMsg(
            "Password reset instructions have been sent to your email address."
          );
          if (res?.data?.Token) {
            setResetToken(res.data.Token);
            setShowResetForm(true);
          }
        } else {
          setErrorMsg(
            res?.data?.Message || "Failed to send reset instructions"
          );
        }
      })
      .catch((e) => {
        setErrorMsg(
          e?.response?.data?.Message ||
            "Error occurred while sending reset instructions"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onMobileSubmit = () => {
    const countryCode = `+${getCountryCallingCode(country)}`;
    const mobileNumber = mobile.slice(1);

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    AxiosFetcher.post("/customer/send-otp/phone", {
      countryCode,
      phone: mobileNumber,
    })
      .then((res) => {
        if (res?.data?.Status) {
          setShowMobileOTP(true);
        } else {
          setErrorMsg(res?.data?.Message || "Failed to send OTP");
        }
      })
      .catch((e) => {
        setErrorMsg(
          e?.response?.data?.Message || "Error occurred while sending OTP"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMobileOTPVerified = (token: string) => {
    setResetToken(token);
    setShowMobileOTP(false);
    setShowResetForm(true);
  };

  if (showResetForm) {
    return (
      <ResetPassword
        token={resetToken}
        mobile={mode === "mobile" ? mobile : undefined}
        countryCode={
          mode === "mobile" ? `+${getCountryCallingCode(country)}` : undefined
        }
        onBack={() => {
          setShowResetForm(false);
          if (mode === "mobile") {
            setShowMobileOTP(true);
          }
        }}
        setModalOpen={setModalOpen}
      />
    );
  }

  if (showMobileOTP && mode === "mobile") {
    return (
      <MobileOTPVerification
        mobile={mobile.slice(1)}
        countryCode={`+${getCountryCallingCode(country)}`}
        onBack={() => setShowMobileOTP(false)}
        onVerified={handleMobileOTPVerified}
      />
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col gap-4 px-4 py-6">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg font-semibold">
              Forgot Password
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "email"
              ? "Enter your email address and we'll send you instructions to reset your password."
              : "Enter your mobile number and we'll send you an OTP to reset your password."}
          </p>
        </CardHeader>

        {mode === "email" ? (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email Address</Label>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          className="pl-10"
                          placeholder="Enter your email address"
                          onChange={(e) => {
                            field.onChange(e);
                            if (errorMsg) setErrorMsg(null);
                            if (successMsg) setSuccessMsg(null);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">
                    {errorMsg}
                  </AlertDescription>
                </Alert>
              )}

              {successMsg && (
                <Alert className="py-2 border-green-200 bg-green-50">
                  <AlertDescription className="text-xs text-green-800">
                    {successMsg}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full rounded-md bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...mobileForm}>
            <form
              onSubmit={mobileForm.handleSubmit(onMobileSubmit)}
              className="space-y-4"
            >
              <FormField
                control={mobileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phone">Mobile Number</Label>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        onCountryChange={handleCountryChange}
                        defaultCountry="IN"
                        international
                        className="rounded-md"
                        placeholder="Enter your mobile number"
                        title="Please enter a valid phone number"
                        onChange={(value) => {
                          field.onChange(value);
                          handlePhoneChange(value || "");
                          if (errorMsg) setErrorMsg(null);
                          if (successMsg) setSuccessMsg(null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMsg && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-xs">
                    {errorMsg}
                  </AlertDescription>
                </Alert>
              )}

              {successMsg && (
                <Alert className="py-2 border-green-200 bg-green-50">
                  <AlertDescription className="text-xs text-green-800">
                    {successMsg}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full rounded-md bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground p-0 h-auto"
            onClick={onBack}
          >
            Back to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
