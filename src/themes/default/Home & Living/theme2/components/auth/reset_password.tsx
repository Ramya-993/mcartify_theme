"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import { toastError, toastSuccess } from "@/utils/toastConfig";
import { login } from "@/store/slices/user";
import { togglePopModal } from "@/store/slices/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Schema for password reset
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password must not exceed 50 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordProps {
  token: string;
  mobile?: string;
  countryCode?: string;
  onBack: () => void;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetPassword = ({
  token,
  mobile,
  countryCode,
  onBack,
  setModalOpen,
}: ResetPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    // Use mobile-specific endpoint if mobile data is provided
    const endpoint =
      mobile && countryCode
        ? "/customer/resetPassword/phone"
        : "/customer/resetPassword";

    const payload =
      mobile && countryCode
        ? {
            password: data.password,
            confirmPassword: data.confirmPassword,
          }
        : {
            password: data.password,
            confirmPassword: data.confirmPassword,
          };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    AxiosFetcher.post(endpoint, payload, config)
      .then((res) => {
        if (res?.data?.Status) {
          toastSuccess("Password reset successfully! You are now logged in.");

          // Auto-login after successful password reset
          if (res?.data?.Token) {
            localStorage.setItem("token", res.data.Token);
            dispatch(login(res.data.Token));
          }

          // Close modal
          if (setModalOpen) {
            setModalOpen(false);
          }
          dispatch(togglePopModal(false));
        } else {
          setErrorMsg(res?.data?.Message || "Failed to reset password");
        }
      })
      .catch((e) => {
        setErrorMsg(
          e?.response?.data?.Message ||
            "Error occurred while resetting password"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
              Reset Password
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">New Password</Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        placeholder="Enter new password"
                        onChange={(e) => {
                          field.onChange(e);
                          if (errorMsg) setErrorMsg(null);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        placeholder="Confirm new password"
                        onChange={(e) => {
                          field.onChange(e);
                          if (errorMsg) setErrorMsg(null);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
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

            <Button
              type="submit"
              className="w-full rounded-md bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
