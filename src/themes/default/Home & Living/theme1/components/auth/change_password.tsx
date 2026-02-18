"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosFetcher } from "@/utils/axios";
import { toastError, toastSuccess } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Schema for change password
const changePasswordSchema = z
  .object({
    password: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" })
      .max(50, { message: "New password must not exceed 50 characters" }),
    confirmNewPassword: z
      .string()
      .min(6, {
        message: "Confirm new password must be at least 6 characters",
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ChangePassword = ({ onSuccess, onCancel }: ChangePasswordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    const token = localStorage.getItem("token");

    AxiosFetcher.post(
      "/customer/changePassword",
      {
        password: data.password,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res?.data?.Status) {
          toastSuccess("Password changed successfully!");
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setErrorMsg(res?.data?.Message || "Failed to change password");
        }
      })
      .catch((e) => {
        setErrorMsg(
          e?.response?.data?.Message || "Error occurred while changing password"
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
          <CardTitle className="text-lg font-semibold">
            Change Password
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Current Password</Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        id="password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        placeholder="Enter current password"
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
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="newPassword">New Password</Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
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
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
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
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmNewPassword">
                    Confirm New Password
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        id="confirmNewPassword"
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

            <div className="flex gap-3 pt-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
