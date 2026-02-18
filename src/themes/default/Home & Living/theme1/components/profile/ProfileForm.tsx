"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/custom-components/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Customer } from "@/types/customer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Country, isValidPhoneNumber } from "react-phone-number-input";

// Zod validation schema
const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine(
      (val) => val.trim().length > 0,
      "Name cannot be empty or just spaces"
    )
    .refine(
      (val) => val.trim().length >= 2,
      "Name must be at least 2 characters"
    )
    .refine(
      (val) => val.trim().length <= 50,
      "Name must be less than 50 characters"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  gender: z.string().min(1, "Please select your gender"),
  // customerId: z.string().optional(),
  countryCode: z.string().optional(),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 120); // Max age 120 years

      if (selectedDate > today) {
        return false;
      }
      if (selectedDate < minDate) {
        return false;
      }
      return true;
    }, "Please enter a valid date of birth"),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(isValidPhoneNumber, { message: "Invalid phone number format" }),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export interface ProfileFormProps {
  customer: Customer | null;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  customer,
  onCancel,
  onSubmit,
  isLoading,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [country, setCountry] = React.useState<Country>("IN"); // Used for PhoneInput country selection

  // Memoize defaultValues to prevent re-rendering
  const defaultValues = React.useMemo(() => {
    // Format phone number to E.164 format if it exists and doesn't start with +
    let formattedPhone = customer?.phone || "";
    if (formattedPhone && !formattedPhone.startsWith("+")) {
      // Assume Indian number if no country code provided
      formattedPhone = `+91${formattedPhone}`;
    }

    return {
      name: customer?.name || "",
      email: customer?.email || "",
      gender: customer?.gender || "",
      countryCode: customer?.countryCode || "",
      dob: customer?.dob || "",
      phone: formattedPhone,
    };
  }, [customer]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Memoize handlers to prevent re-rendering
  const handleCountryChange = React.useCallback((newCountry: Country) => {
    setCountry(newCountry);
  }, []);

  const handleSubmit = React.useCallback(
    async (data: ProfileFormData) => {
    await onSubmit(data);
    },
    [onSubmit]
  );

  const handlePhoneChange = React.useCallback(
    (
      value: string | undefined,
      field: { onChange: (value: string | undefined) => void }
    ) => {
      field.onChange(value);
    },
    []
  );

  // Reset form when customer data changes
  React.useEffect(() => {
    if (customer) {
      form.reset(defaultValues);
    }
  }, [customer, defaultValues, form]);

  return (
    <Card className="w-full border-(color:--profile-border) bg-(color:--profile-bg)">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-(weight:--profile-title-weight) text-(color:--profile-title)">
          Edit Profile
        </CardTitle>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-(color:--profile-cancel) hover:text-(color:--profile-cancel-hover)"
        >
          Cancel
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(color:--profile-label)">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        className="border-(color:--profile-input-border) bg-(color:--profile-input-bg) text-(color:--profile-input-text)"
                        placeholder="Enter your name"
                      />
                    </FormControl>
                    <FormMessage className="text-(color:--profile-error)" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(color:--profile-label)">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={isLoading}
                        className="border-(color:--profile-input-border) bg-(color:--profile-input-bg) text-(color:--profile-input-text)"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="text-(color:--profile-error)" />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(color:--profile-label)">
                      Gender
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-(color:--profile-input-border) bg-(color:--profile-input-bg) text-(color:--profile-input-text)">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-(color:--profile-error)" />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(color:--profile-label)">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        onCountryChange={handleCountryChange}
                        defaultCountry="IN"
                        international
                        disabled={isLoading}
                        className="border-(color:--profile-input-border) bg-(color:--profile-input-bg) text-(color:--profile-input-text)"
                        placeholder="Enter your phone number"
                        onChange={(value) => handlePhoneChange(value, field)}
                      />
                    </FormControl>
                    <FormMessage className="text-(color:--profile-error)" />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(color:--profile-label)">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={isLoading}
                        className="border-(color:--profile-input-border) bg-(color:--profile-input-bg) text-(color:--profile-input-text)"
                      />
                    </FormControl>
                    <FormMessage className="text-(color:--profile-error)" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className="w-full bg-(color:--primary) text-(color:--profile-button-text) hover:bg-(color:--primary-hover) disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
