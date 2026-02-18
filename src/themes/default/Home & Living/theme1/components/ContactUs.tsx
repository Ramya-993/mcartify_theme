"use client";

import React from "react";
import { useContactUs } from "@/themes/hooks/useContactUs";
import { useContactForm } from "@/themes/hooks/useContactForm";
import { FormField } from "@/store/slices/contactForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField as FormFieldComponent,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Mail, Loader2, MapPin } from "lucide-react";

// Add custom CSS for aggressive text wrapping
const customStyles = `
  .contact-text-wrap {
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
    hyphens: auto !important;
    white-space: normal !important;
    max-width: 100% !important;
    overflow: hidden !important;
  }
  
  .contact-card-container {
    overflow: hidden !important;
    max-width: 100% !important;
  }
  
  .contact-card-content {
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    max-width: 100% !important;
  }
`;

// Modern Loading State
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center space-y-6 p-12 md:p-20 bg-[--contact-loading-bg] rounded-xl shadow-lg min-h-[350px] transition-all duration-300 ease-in-out">
    <div className="relative flex items-center justify-center">
      <div className="absolute h-24 w-24 md:h-32 md:w-32 bg-[--contact-loading-pulse-bg-outer] rounded-full animate-pulse opacity-30"></div>
      <div className="absolute h-16 w-16 md:h-20 md:w-20 bg-[--contact-loading-pulse-bg-inner] rounded-full animate-pulse opacity-50 delay-150"></div>
      <Loader2 className="h-12 w-12 md:h-16 md:w-16 text-[--contact-loading-indicator] animate-spin-slow" />
    </div>
    <p className="text-2xl md:text-3xl font-bold text-[--contact-loading-text] font-display tracking-tight break-anywhere word-break overflow-wrap-anywhere">
      Loading Information
    </p>
    <p className="text-md md:text-lg text-[--contact-loading-subtext] font-primary max-w-xs text-center break-anywhere word-break overflow-wrap-anywhere hyphens-auto">
      Just a moment while we fetch the details for you.
    </p>
  </div>
);

// Dynamic Form Field Renderer
const DynamicFormField = ({
  field,
  form,
}: {
  field: FormField;
  form: ReturnType<typeof useContactForm>["form"];
}) => {
  const fieldName = `field_${field.fieldId}`;
  const isRequired = field.required === 1;

  const renderFormField = () => {
    switch (field.type) {
      case "text":
      case "":
      default:
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={
                      field.placeholder ||
                      `Enter your ${field.label.toLowerCase()}`
                    }
                    className="w-full break-anywhere word-break overflow-wrap-anywhere"
                    {...formField}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "email":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={
                      field.placeholder ||
                      `Enter your ${field.label.toLowerCase()}`
                    }
                    className="w-full break-anywhere word-break overflow-wrap-anywhere"
                    {...formField}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "tel":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={
                      field.placeholder ||
                      `Enter your ${field.label.toLowerCase()}`
                    }
                    className="w-full break-anywhere word-break overflow-wrap-anywhere"
                    {...formField}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = target.value.replace(/[^0-9+\-\s()]/g, "");
                      target.value = value;
                      formField.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={
                      field.placeholder || `Enter ${field.label.toLowerCase()}`
                    }
                    className="w-full break-anywhere word-break overflow-wrap-anywhere"
                    min={field.validation.min}
                    max={field.validation.max}
                    {...formField}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={
                      field.placeholder ||
                      `Enter your ${field.label.toLowerCase()}`
                    }
                    className="w-full min-h-[120px] resize-vertical break-anywhere word-break overflow-wrap-anywhere"
                    {...formField}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          field.placeholder ||
                          `Select ${field.label.toLowerCase()}`
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "radio":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option, index) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <FormLabel className="font-normal break-anywhere word-break overflow-wrap-anywhere">
                          {option}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    {field.options?.map((option, index) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={
                              Array.isArray(formField.value)
                                ? formField.value.includes(option)
                                : formField.value === option
                            }
                            onCheckedChange={(checked) => {
                              const currentValue = Array.isArray(
                                formField.value
                              )
                                ? formField.value
                                : [];
                              if (checked) {
                                formField.onChange([...currentValue, option]);
                              } else {
                                formField.onChange(
                                  currentValue.filter(
                                    (value: string) => value !== option
                                  )
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal break-anywhere word-break overflow-wrap-anywhere">
                          {option}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "date":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="w-full break-anywhere word-break overflow-wrap-anywhere"
                    {...formField}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );

      case "url":
        return (
          <FormFieldComponent
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-2 break-anywhere word-break overflow-wrap-anywhere">
                  {field.label} {isRequired && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder={
                      field.placeholder || `Enter ${field.label.toLowerCase()}`
                    }
                    className="w-full break-anywhere word-break overflow-wrap-anywhere"
                    {...formField}
                  />
                </FormControl>
                <FormMessage className="text-red-500 font-primary break-anywhere word-break overflow-wrap-anywhere hyphens-auto" />
              </FormItem>
            )}
          />
        );
    }
  };

  return <div key={field.fieldId}>{renderFormField()}</div>;
};

// Dynamic Contact Form Component
const DynamicContactForm = () => {
  const {
    form,
    contactForm,
    formFields,
    loading,
    isSubmitting,
    error,
    isDynamicForm,
    onSubmit,
    retryFetchContactForm,
    isLoadingForm,
    submitError,
    isSuccess,
  } = useContactForm();

  // Show loading state while fetching form data
  if (isLoadingForm) {
    return <LoadingState />;
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl border border-red-200 max-w-2xl mx-auto">
        <div className="space-y-4">
          <p className="text-lg text-red-800 font-primary break-anywhere">
            {error.includes("429") || error.includes("Too many requests")
              ? "Too many requests - please try again later."
              : error}
          </p>
        </div>
      </div>
    );
  }

  // Show fallback message when no dynamic form is available
  if (!isDynamicForm || !formFields.length) {
    return (
      <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-200 max-w-2xl mx-auto">
        <div className="space-y-4">
          <p className="text-lg text-amber-800 font-primary break-anywhere">
            Contact form is currently not available. Please use the contact
            information above to reach us.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl break-anywhere">
            {contactForm?.name || "Send us a Message"}
          </CardTitle>
          <CardDescription className="break-anywhere word-break overflow-wrap-anywhere hyphens-auto">
            {contactForm?.description ||
              "Fill out the form below and we'll get back to you as soon as possible."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                {formFields.map((field) => (
                  <DynamicFormField
                    key={field.fieldId}
                    field={field}
                    form={form}
                  />
                ))}
              </div>

              {/* Show submit error if any */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 break-anywhere">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Show success message */}
              {isSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 break-anywhere">
                    Message sent successfully! We&apos;ll get back to you soon.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-(color:--primary) to-(color:--primary-hover) hover:from-(color:--primary-hover) hover:to-(color:--primary) text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 break-anywhere disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  contactForm?.settings?.submitButtonText || "Send Message"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

const ContactUs = () => {
  const {
    contactInfo,
    loading: contactLoading,
    error: contactError,
  } = useContactUs();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div
        className="min-h-screen w-full overflow-hidden contact-card-container"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          maxWidth: "100vw",
        }}
      >
        {/* Hero Section */}

        <div className="bg-gradient-to-r from-(color:--primary) to-(color:--primary-hover) text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Mail className="mx-auto h-20 w-20 md:h-24 md:w-24 mb-6 opacity-90" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 break-anywhere">
                Contact Us
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto break-anywhere word-break overflow-wrap-anywhere hyphens-auto">
                We&apos;d love to hear from you. Send us a message and
                we&apos;ll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full overflow-hidden">
          {contactLoading && <LoadingState />}
          {(contactInfo || contactError) && !contactLoading && (
            <div className="space-y-16">
              {/* Contact Information Section */}
              {contactInfo && (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 break-anywhere word-break overflow-wrap-anywhere">
                      Get in Touch
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto break-anywhere word-break overflow-wrap-anywhere hyphens-auto">
                      Have a question or want to work together? We&apos;re here
                      to help and would love to hear from you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 w-full overflow-hidden">
                    {contactInfo.address &&
                      contactInfo.address.enabled === 1 && (
                        <ContactDetailItem
                          icon={<MapPin className="h-6 w-6 text-blue-600" />}
                          title="Address"
                          lines={
                            contactInfo.address?.address
                              ? [contactInfo.address.address]
                              : []
                          }
                        />
                      )}
                    {contactInfo.phoneNumbers &&
                      contactInfo.phoneNumbers.enabled === 1 && (
                        <ContactDetailItem
                          icon={<Phone className="h-6 w-6 text-green-600" />}
                          title="Phone Support"
                          lines={
                            contactInfo.phoneNumbers &&
                            typeof contactInfo.phoneNumbers === "object"
                              ? Object.entries(contactInfo.phoneNumbers)
                                  .filter(
                                    ([key, val]) =>
                                      key !== "enabled" &&
                                      typeof val === "string" &&
                                      val.trim() !== ""
                                  )
                                  .map(([, val]) => val as string)
                              : []
                          }
                          isLink="tel"
                        />
                      )}
                    {contactInfo.emailAddresses &&
                      contactInfo.emailAddresses.enabled === 1 && (
                        <ContactDetailItem
                          icon={<Mail className="h-6 w-6 text-purple-600" />}
                          title="Email Support"
                          lines={
                            contactInfo.emailAddresses &&
                            typeof contactInfo.emailAddresses === "object"
                              ? Object.entries(contactInfo.emailAddresses)
                                  .filter(
                                    ([key, val]) =>
                                      key !== "enabled" &&
                                      typeof val === "string" &&
                                      val.trim() !== ""
                                  )
                                  .map(([, val]) => val as string)
                              : []
                          }
                          isLink="mailto"
                        />
                      )}
                  </div>
                </div>
              )}

              {/* Dynamic Contact Form */}
              <DynamicContactForm />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface ContactDetailItemProps {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  isLink?: "tel" | "mailto";
}

const ContactDetailItem = ({
  icon,
  title,
  lines,
  isLink,
}: ContactDetailItemProps) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden contact-card-container">
    <CardContent className="p-6 w-full overflow-hidden contact-card-content">
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-full flex-shrink-0 ${
            title === "Address"
              ? "bg-blue-100"
              : title === "Phone Support"
              ? "bg-green-100"
              : title === "Email Support"
              ? "bg-purple-100"
              : "bg-orange-100"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-semibold text-gray-900 mb-2 contact-text-wrap">
            {title}
          </h3>
          <div className="space-y-1">
            {lines.map((line, index) =>
              line ? (
                <div
                  key={index}
                  className="text-gray-600 text-sm leading-relaxed contact-text-wrap"
                >
                  {isLink ? (
                    <a
                      href={`${isLink}:${line.trim()}`}
                      className="hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm transition-colors duration-150 ease-in-out contact-text-wrap block"
                    >
                      {line}
                    </a>
                  ) : (
                    <span className="contact-text-wrap block">{line}</span>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

ContactUs.displayName = "ContactUs";
export default ContactUs;
