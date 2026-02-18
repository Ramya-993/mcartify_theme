"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  Country,
  formatPhoneNumber,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/custom-components/phone-input";

// Custom hook for signup functionality
import { useSignup } from "@/themes/hooks/useSignup";

// Define Zod schema for form validation
const signupSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .refine(isValidPhoneNumber, { message: "Invalid phone number format" }),
    areaPincode: z
      .string()
      .min(1, { message: "Pincode is required" })
      .regex(/^[0-9]{6}$/, { message: "Please enter a valid 6-digit pincode" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormData {
  name: string;
  countryCode: string;
  phone: string;
  areaPincode: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const { handleSignup, isLoading } = useSignup();
  const [country, setCountry] = useState<Country>("IN");

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      phone: "",
      areaPincode: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleCountryChange = (newCountry: Country) => {
    setCountry(newCountry);
  };

  const onSubmit = (data: SignupFormValues) => {
    // Convert phone number to required format
    const countryCode = `+${getCountryCallingCode(country)}`;
    let phoneNumber = "";

    if (data.phone) {
      const nationalFormatNumber = formatPhoneNumber(data.phone);
      phoneNumber = nationalFormatNumber.replace(/\D/g, "");
      // Remove first character if it starts with country code digits
      if (phoneNumber.length > 10) {
        phoneNumber = phoneNumber.slice(-10);
      }
    }

    // Transform data to match expected payload structure
    const signupData: SignupFormData = {
      name: data.name,
      countryCode: countryCode,
      phone: phoneNumber,
      areaPincode: data.areaPincode,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    handleSignup(signupData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-bold text-center font-(family-name:--font-secondary)">
            Create Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-(family-name:--font-primary)">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Full Name" />
                    </FormControl>
                    <FormMessage className="font-(family-name:--font-primary)" />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-(family-name:--font-primary)">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        onCountryChange={handleCountryChange}
                        defaultCountry="IN"
                        international
                        placeholder="Enter Phone Number"
                        title="Please enter a valid phone number"
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="font-(family-name:--font-primary)" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-(family-name:--font-primary)">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email Address"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage className="font-(family-name:--font-primary)" />
                  </FormItem>
                )}
              />

              {/* Area Pincode Field */}
              <FormField
                control={form.control}
                name="areaPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-(family-name:--font-primary)">
                      Area Pincode
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Area Pincode" />
                    </FormControl>
                    <FormMessage className="font-(family-name:--font-primary)" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-(family-name:--font-primary)">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage className="font-(family-name:--font-primary)" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-(family-name:--font-primary)">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm Password"
                      />
                    </FormControl>
                    <FormMessage className="font-(family-name:--font-primary)" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                <span className="font-(family-name:--font-primary)">
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground font-(family-name:--font-primary)">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-semibold hover:underline font-(family-name:--font-primary)"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
