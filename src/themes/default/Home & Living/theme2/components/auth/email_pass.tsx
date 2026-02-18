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
import { toastSuccess, toastError } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import ForgotPassword from "./forgot_password";

interface LoginWithEmailAndPasswordProps {
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginWithEmailAndPassword = ({
  setModalOpen,
}: LoginWithEmailAndPasswordProps) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = (data: { email: string; password: string }) => {
    AxiosFetcher.post("/customer/login/email", data)
      .then((res) => {
        if (res?.data?.Status) {
          dispatch(login(res.data.Token));
          localStorage.setItem("token", res.data.Token);
          toastSuccess("Login successful");
          // Close modal using the passed setter if available
          if (setModalOpen) {
            setModalOpen(false);
          }
          // Also dispatch Redux action for backward compatibility
          dispatch(togglePopModal(false));
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
      .catch((e) => {
        toastError(e?.response?.data?.Message || "Error occurred");
      });
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        mode="email"
        onBack={() => setShowForgotPassword(false)}
        setModalOpen={setModalOpen}
      />
    );
  }

  return (
    <div className="auth-form space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Welcome Back!</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      {...field}
                      placeholder="Enter your Email"
                      className="pl-10 rounded-full"
                    />
                  </div>
                </FormControl>
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      {...field}
                      type={passwordShown ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 rounded-full"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                      onClick={() => setPasswordShown(!passwordShown)}
                    >
                      {passwordShown ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </FormControl>
                {errors.password && (
                  <FormMessage>{errors.password.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-full bg-primary hover:bg-primary/50 cursor-pointer"
          >
            Continue
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-blue-500 cursor-pointer"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </Button>
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-blue-500 cursor-pointer"
          onClick={() => {
            // Close modal using the passed setter if available
            if (setModalOpen) {
              setModalOpen(false);
            }
            // Also dispatch Redux action for backward compatibility

            router.push("/sign-up");
            dispatch(togglePopModal(false));
          }}
        >
          Sign up
        </Button>
      </div>

      <div className="text-center text-xs text-(color:--muted-foreground)">
        By continuing you agree to our
        <br />
        <Link
          href="/privacy-policy"
          className="text-blue-500 underline"
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
          className="text-blue-500 underline"
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
    </div>
  );
};

export default LoginWithEmailAndPassword;
