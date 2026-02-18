"use client";

import { fetchCart } from "@/store/slices/cart";
import { togglePopModal } from "@/store/slices/modal";
import { login, fetchCustomer } from "@/store/slices/user";
import { AppDispatch } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toastError, toastSuccess } from "@/utils/toastConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PhoneInput } from "@/components/custom-components/phone-input";
import {
  Country,
  formatPhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";

// Shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ForgotPassword from "./forgot_password";

// Define Zod schema for form validation
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password must not exceed 50 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginWithMobileAndPasswordProps {
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginWithMobileAndPassword = ({
  setModalOpen,
}: LoginWithMobileAndPasswordProps) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState<Country>("IN");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Initialize React Hook Form with Zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  // Update mobile value when phone changes
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

  const onSubmit = (formData: LoginFormValues) => {
    const countryCode = `+${getCountryCallingCode(country)}`;
    const mobileNumber = mobile.slice(1);
    setIsLoading(true);
    AxiosFetcher.post("/customer/login/phone", {
      countryCode,
      phone: mobileNumber,
      password: formData.password,
    })
      .then((res) => {
        if (res?.data?.Status) {
          dispatch(login(res.data.Token));
          localStorage.setItem("token", res.data.Token);
          dispatch(togglePopModal(false));
          toastSuccess("Login successful");
        } else {
          // Handle unsuccessful login
          toastError(res?.data?.Message || "Login failed");
        }
      })
      .then(() => {
        dispatch(fetchCart());
        // Fetch customer details for non-guest users
        const token = localStorage.getItem("token");
        if (token) {
          dispatch(fetchCustomer());
        }
      })
      .catch((err) => {
        // Type narrowing for error object
        let errorMessage = "Error occurred";
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "Message" in err.response.data
        ) {
          errorMessage = String(err.response.data.Message) || errorMessage;
        }
        toastError(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        mode="mobile"
        onBack={() => setShowForgotPassword(false)}
        setModalOpen={setModalOpen}
      />
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-4 py-10"
          >
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-2xl font-(weight:--font-medium) text-(color:--foreground)">
                Welcome Back!
              </CardTitle>
            </CardHeader>

            {/* Phone Input */}
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
                          className="rounded-md"
                          placeholder="Enter Phone Number"
                          title="Please enter a valid phone number"
                          onChange={(value) => {
                            field.onChange(value);
                            handlePhoneChange(value || "");
                          }}
                        />

                        {/* {field.value && (
                          <div className="text-xs text-(color:--muted-foreground) px-2">
                            {country && (
                              <div className="flex items-center justify-between border-b border-dashed border-(color:--border-color) py-1">
                                <span>Country code:</span>
                                <span className="font-(weight:--font-medium)">
                                  +{getCountryCallingCode(country)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between py-1">
                              <span>Formatted:</span>
                              <span className="font-(weight:--font-medium)">
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

            {/* Password Input */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-(color:--muted-foreground)">
                          <Lock className="h-4 w-4" />
                        </div>
                        <Input
                          id="password"
                          type={passwordShown ? "text" : "password"}
                          className="pl-10"
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setPasswordShown(!passwordShown)}
                        >
                          {passwordShown ? (
                            <EyeOff className="h-4 w-4 text-(color:--muted-foreground)" />
                          ) : (
                            <Eye className="h-4 w-4 text-(color:--muted-foreground)" />
                          )}
                        </Button>
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
              {isLoading ? "Logging in..." : "Continue"}
            </Button>

            <div className="flex flex-col justify-between gap-2 pt-3">
              <div className="flex items-center justify-between mb-2">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-blue-500 cursor-pointer"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Close modal using the passed setter if available
                  if (setModalOpen) {
                    setModalOpen(false);
                  }
                  // Also dispatch Redux action for backward compatibility
                  dispatch(togglePopModal(false));
                  // Navigate to sign-up page
                  router.push("/sign-up");
                }}
                className="w-full cursor-pointer text-blue-500 border-(color:--primary) font-(weight:--font-medium) hover:bg-(color:--primary) hover:text-(color:--white)"
                size="default"
              >
                Sign up
              </Button>
            </div>

            <p className="text-center text-xs text-(color:--muted-foreground) mt-2">
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginWithMobileAndPassword;
