"use client";

import Link from "next/link";
import React, { useState } from "react";
import OTPInput from "./otp_screen";
import { AxiosFetcher } from "@/utils/axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/StoreProvider";
import { login } from "@/store/slices/user";
import { togglePopModal } from "@/store/slices/modal";
import { fetchCart } from "@/store/slices/cart";
import { toastError } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/custom-components/phone-input";
import {
  Country,
  formatPhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Define Zod schema for phone validation
const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number format" }),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface MobileAndOTPProps {
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileAndOTP = ({ setModalOpen }: MobileAndOTPProps) => {
  const [enterOtpShown, setEnterOtpShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState<Country>("IN");
  const dispatch = useDispatch<AppDispatch>();

  // Initialize React Hook Form with Zod validation
  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Update mobile value when phone changes for OTP screen
  const handlePhoneChange = (value: string) => {
    if (value) {
      const nationalFormatdNumber = formatPhoneNumber(value);
      const formattedPhoneNumber = nationalFormatdNumber.replace(/\D/g, "");
      setMobile(formattedPhoneNumber);
    }
  };

  const handleCountryChange = (newCountry: Country) => {
    setCountry(newCountry);
  };

  // Form submission handler
  const onSubmit = () => {
    const countryCode = `+${getCountryCallingCode(country)}`;
    // mobile = "09398676662" remove first charactor
    const mobileNumber = mobile.slice(1);
    setIsLoading(true);
    AxiosFetcher.post("customer/send-otp/phone", {
      countryCode: countryCode,
      phone: mobileNumber,
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
          err?.response?.data?.Message || "Error occurred while sending OTP"
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
    // Close modal using the passed setter if available
    if (setModalOpen) {
      setModalOpen(false);
    }
    // Also dispatch Redux action for backward compatibility
    dispatch(togglePopModal(false));
  };

  return (
    <div className="auth-form space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Welcome back!</h1>
      {enterOtpShown ? (
        <OTPInput
          mobile={mobile}
          countryCode={`+${getCountryCallingCode(country)}`}
          setModalOpen={setModalOpen}
        />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-3">
                        <PhoneInput
                          {...field}
                          onCountryChange={handleCountryChange}
                          defaultCountry="IN"
                          international
                          className="rounded-full"
                          placeholder="Enter Phone Number"
                          title="Please enter a valid phone number"
                          onChange={(value) => {
                            field.onChange(value);
                            handlePhoneChange(value || "");
                          }}
                        />

                        {/* {field.value && (
                          <div className="text-xs text-muted-foreground px-2">
                            {country && (
                              <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-1">
                                <span>Country code:</span>
                                <span className="font-medium">
                                  +{getCountryCallingCode(country)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between py-1">
                              <span>Formatted:</span>
                              <span className="font-medium">
                                {formatPhoneNumber(field.value)}
                              </span>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="mt-4 w-full rounded-md bg-primary hover:bg-primary/50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Continue"}
            </Button>

            <div className="text-center text-xs text-(color:--muted-foreground)">
              By continuing you agree to our
              <br />
              <Link
                href="/privacy-policy"
                className="text-(color:--blue-500) underline"
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
                className="text-(color:--blue-500) underline"
                onClick={() => {
                  if (setModalOpen) {
                    setModalOpen(false);
                  }
                  dispatch(togglePopModal(false));
                }}
              >
                Terms of Use
              </Link>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default MobileAndOTP;
