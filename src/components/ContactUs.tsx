import React, { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "@/components/ui/breadcrumbs";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { fetchContact } from "@/store/slices/contactInfo";
import { AxiosFetcher } from "@/utils/axios";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Zod schema for contact form validation
const createContactSchema = (fields: Record<string, string | number>) => {
  const schemaFields: Record<string, z.ZodString> = {};

  Object.keys(fields).forEach((key) => {
    if (key === "enabled" || typeof fields[key] !== "string") return;

    switch (key) {
      case "email":
        schemaFields[key] = z
          .string()
          .min(1, `${fields[key]} is required`)
          .email("Invalid email address");
        break;
      case "phone":
        schemaFields[key] = z
          .string()
          .min(1, `${fields[key]} is required`)
          .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number");
        break;
      case "message":
        schemaFields[key] = z
          .string()
          .min(10, `${fields[key]} must be at least 10 characters`);
        break;
      case "subject":
      case "userName":
      default:
        schemaFields[key] = z
          .string()
          .min(2, `${fields[key]} must be at least 2 characters`);
        break;
    }
  });

  return z.object(schemaFields);
};

// Dynamic Contact Form Component with shadcn UI
const DynamicContactForm = ({
  getInTouchFields,
}: {
  getInTouchFields: Record<string, string | number>;
}) => {
  const contactSchema = createContactSchema(getInTouchFields);
  type ContactFormValues = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: Object.keys(getInTouchFields).reduce((acc, key) => {
      if (key !== "enabled" && typeof getInTouchFields[key] === "string") {
        acc[key] = "";
      }
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await AxiosFetcher.post("/stores/contactUs", data);
      if (response?.data?.Status === 1) {
        toastSuccess("Message sent successfully!");
        form.reset();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { Message?: string } } };
      toastError(
        error?.response?.data?.Message || "Error occurred while sending message"
      );
    }
  };

  const renderField = (fieldKey: string, label: string) => {
    switch (fieldKey) {
      case "email":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={fieldKey}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">{label}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "phone":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={fieldKey}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">{label}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "message":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={fieldKey}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-gray-700">{label}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "subject":
      case "userName":
      default:
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={fieldKey}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">{label}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="bg-gray-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Get in Touch
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(getInTouchFields).map(([key, value]) => {
              if (key === "enabled" || typeof value !== "string") return null;
              return renderField(key, value);
            })}
          </div>
          <div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ContactUs = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { contactInfo, loading } = useSelector(
    (state: RootState) => state.contact
  );

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  const getInTouchFields = contactInfo?.getInTouchFields || {};
  const isContactFormEnabled = getInTouchFields.enabled === 1;

  return (
    <>
      <div className="bg-gray-50">
        <div className="container max-w-7xl md:px-4 px-2">
          <Breadcrumb
            crumbItems={[
              { href: "/", label: "Home", isCurrent: false, isDisabled: false },
              {
                href: "/contact-us",
                label: "Contact Us",
                isCurrent: true,
                isDisabled: false,
              },
            ]}
          />
        </div>

        <div className="container mx-auto md:px-4 py-8">
          <div className="grid gap-6 md:grid-cols-[30%_1fr]">
            {/* Contact Information */}
            <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
              {loading && (
                <p className="text-center">Loading contact info...</p>
              )}

              {/* Address */}
              {contactInfo && (
                <div className="flex flex-col items-center border-b py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 inline mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <p className="text-center text-gray-800">
                    {contactInfo?.address?.apartmentBuilding},{" "}
                    {contactInfo?.address?.areaLocation} <br />
                    {contactInfo?.address?.stateCity},{" "}
                    {contactInfo?.address?.country},{" "}
                    {contactInfo?.address?.pincode}
                  </p>
                </div>
              )}

              {/* Phone */}
              {contactInfo && (
                <div className="flex flex-col items-center border-b py-8">
                  <svg
                    className="w-8 h-8 text-gray-800"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <p className="text-center text-gray-800">
                    {contactInfo?.phoneNumbers?.[0] ||
                      contactInfo?.phone ||
                      "+1 (555) 123-4567"}{" "}
                    <br />
                    {contactInfo?.phoneNumbers?.[1] ||
                      contactInfo?.alternatePhone ||
                      "+1 (555) 987-6543"}
                  </p>
                </div>
              )}

              {/* Email */}
              {contactInfo && (
                <div className="flex flex-col items-center py-8">
                  <svg
                    className="w-8 h-8 text-gray-800"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-center text-gray-800">
                    {contactInfo?.emailAddresses?.[0] ||
                      contactInfo?.email ||
                      "support@example.com"}{" "}
                    <br />
                    {contactInfo?.emailAddresses?.[1] || "info@example.com"}
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Contact Form */}
            {isContactFormEnabled &&
              Object.keys(getInTouchFields).length > 1 && (
                <DynamicContactForm getInTouchFields={getInTouchFields} />
              )}

            {!isContactFormEnabled && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-center p-8">
                  <p className="text-lg text-gray-600">
                    Contact form is currently disabled. Please use the contact
                    information above to reach us.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

ContactUs.displayName = "ContactUs";

export default ContactUs;
