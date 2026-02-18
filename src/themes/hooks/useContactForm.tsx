import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormField } from "@/store/slices/contactForm";
import { AxiosFetcher } from "@/utils/axios";

// API functions for TanStack Query
const fetchContactFormData = async () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("guest_token") || "";

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await AxiosFetcher.get("/stores/contactUs", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response?.data?.Status !== 1) {
    throw new Error(response?.data?.Message || "Failed to fetch contact form");
  }

  return response.data;
};

const submitContactForm = async (data: {
  dynamicForm: number;
  formId: number;
  formFields: Array<{ label: string; fieldId: number; value: string }>;
}) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("guest_token") || "";

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await AxiosFetcher.post("/stores/contactUs", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response?.data?.Status !== 1) {
    throw new Error(response?.data?.Message || "Failed to submit contact form");
  }

  return response.data;
};

// Helper function to create dynamic Zod schema based on form fields
const createContactFormSchema = (formFields: FormField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  formFields.forEach((field) => {
    const { type, label, required, validation } = field;
    let fieldSchema: z.ZodTypeAny;

    switch (type) {
      case "email":
        fieldSchema = z.string();
        if (required === 1) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${label} is required`
          );
        }
        fieldSchema = (fieldSchema as z.ZodString).email(
          "Invalid email address"
        );
        break;

      case "tel":
        fieldSchema = z.string();
        if (required === 1) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${label} is required`
          );
        }
        fieldSchema = (fieldSchema as z.ZodString).regex(
          /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
          "Please enter a valid phone number"
        );
        break;

      case "number":
        fieldSchema = z.string().refine((val) => !isNaN(Number(val)), {
          message: "Must be a valid number",
        });
        if (required === 1) {
          fieldSchema = z
            .string()
            .min(1, `${label} is required`)
            .refine((val) => !isNaN(Number(val)), {
              message: "Must be a valid number",
            });
        }
        if (validation.min !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => Number(val) >= validation.min!,
            {
              message: `Must be at least ${validation.min}`,
            }
          );
        }
        if (validation.max !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => Number(val) <= validation.max!,
            {
              message: `Must be at most ${validation.max}`,
            }
          );
        }
        break;

      case "textarea":
        fieldSchema = z.string();
        if (required === 1) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${label} is required`
          );
        }
        if (validation.minLength) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            validation.minLength,
            `${label} must be at least ${validation.minLength} characters`
          );
        }
        if (validation.maxLength) {
          fieldSchema = (fieldSchema as z.ZodString).max(
            validation.maxLength,
            `${label} must not exceed ${validation.maxLength} characters`
          );
        }
        break;

      case "select":
      case "radio":
        fieldSchema = z.string();
        if (required === 1) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${label} is required`
          );
        }
        break;

      case "checkbox":
        fieldSchema = z.array(z.string());
        if (required === 1) {
          fieldSchema = z.array(z.string()).min(1, {
            message: `${label} is required`,
          });
        }
        break;

      case "date":
        fieldSchema = z.string();
        if (required === 1) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${label} is required`
          );
        }
        fieldSchema = (fieldSchema as z.ZodString).refine((date) => {
          return !isNaN(Date.parse(date));
        }, "Invalid date format");
        break;

      case "text":
      case "url":
      default:
        fieldSchema = z.string();
        if (required === 1) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${label} is required`
          );
        }
        if (validation.minLength) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            validation.minLength,
            `${label} must be at least ${validation.minLength} characters`
          );
        }
        if (validation.maxLength) {
          fieldSchema = (fieldSchema as z.ZodString).max(
            validation.maxLength,
            `${label} must not exceed ${validation.maxLength} characters`
          );
        }
        if (type === "url") {
          fieldSchema = (fieldSchema as z.ZodString).url(
            "Please enter a valid URL"
          );
        }
        break;
    }

    // Make field optional if not required
    if (required === 0) {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[`field_${field.fieldId}`] = fieldSchema;
  });

  return z.object(schemaFields);
};

export const useContactForm = () => {
  const queryClient = useQueryClient();

  // TanStack Query for fetching contact form data
  const {
    data: contactFormData,
    isLoading: isLoadingForm,
    error: formError,
    refetch: refetchForm,
  } = useQuery({
    queryKey: ["contactForm"],
    queryFn: fetchContactFormData,
    retry: (failureCount, error) => {
      // Don't retry on 429 (rate limit) errors
      if (
        error.message.includes("429") ||
        error.message.includes("Too many requests")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Extract form fields and metadata
  const contactForm = contactFormData?.ContactForm;
  const formFields = contactForm?.formFields || [];
  const isDynamicForm = !!contactForm && formFields.length > 0;

  // Create default values for the form
  const createDefaultValues = (formFields: FormField[]) => {
    const defaults: Record<string, string | string[] | boolean> = {};
    formFields.forEach((field) => {
      if (field.type === "checkbox") {
        defaults[`field_${field.fieldId}`] = [];
      } else {
        defaults[`field_${field.fieldId}`] = "";
      }
    });
    return defaults;
  };

  // Create form schema and form instance
  const formSchema = createContactFormSchema(formFields);
  type ContactFormValues = z.infer<typeof formSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(formFields),
    mode: "onChange", // Enable real-time validation
  });

  // Reset form when form fields change
  useEffect(() => {
    if (formFields.length > 0) {
      form.reset(createDefaultValues(formFields));
    }
  }, [formFields, form]);

  // TanStack Query mutation for form submission
  const submitMutation = useMutation({
    mutationFn: submitContactForm,
    onMutate: () => {
      // Show loading toast
      toast.loading("Sending your message...", {
        id: "contact-form-submit",
      });
    },
    onSuccess: () => {
      // Dismiss loading toast and show success
      toast.dismiss("contact-form-submit");

      const successMessage =
        contactForm?.settings?.successMessage || "Message sent successfully!";
      toast.success(successMessage, {
        description: "We'll get back to you as soon as possible.",
        duration: 4000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });

      // Reset form
      form.reset(createDefaultValues(formFields));

      // Invalidate and refetch related queries if needed
      queryClient.invalidateQueries({ queryKey: ["contactForm"] });
    },
    onError: (error: Error) => {
      // Dismiss loading toast and show error
      toast.dismiss("contact-form-submit");

      let errorMessage = "An error occurred while sending your message";
      let errorDescription = "Please try again later.";

      if (
        error.message.includes("429") ||
        error.message.includes("Too many requests")
      ) {
        errorMessage = "Too many requests";
        errorDescription = "Please wait a moment before trying again.";
      } else if (error.message.includes("Authentication required")) {
        errorMessage = "Authentication required";
        errorDescription = "Please refresh the page and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
        action: {
          label: "Retry",
          onClick: () => {
            // Retry the last submission
            if (form.formState.isValid) {
              form.handleSubmit(onSubmit)();
            }
          },
        },
      });
    },
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Transform the form data to match the API payload format
      const formFieldsData = Object.entries(data).map(([key, value]) => {
        const fieldId = parseInt(key.replace("field_", ""));
        const field = formFields.find(
          (field: FormField) => field.fieldId === fieldId
        );

        return {
          label: field?.label || "",
          fieldId: fieldId,
          value:
            typeof value === "boolean"
              ? value
                ? "true"
                : "false"
              : Array.isArray(value)
              ? value.join(", ")
              : String(value || ""),
        };
      });

      const submitData = {
        dynamicForm: 1,
        formId: contactForm?.formId || 0,
        formFields: formFieldsData,
      };

      console.log("Submitting contact form with payload:", submitData);

      // Use the mutation to submit
      await submitMutation.mutateAsync(submitData);
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Contact form submission error:", error);
    }
  };

  // Loading state combines form loading and submission loading
  const isLoading = isLoadingForm || submitMutation.isPending;

  // Error state
  const error = formError?.message || null;

  return {
    // Form instance
    form,

    // Contact form data
    contactForm,
    formFields: [...formFields].sort((a, b) => a.sortOrder - b.sortOrder),

    // Loading and error states
    loading: isLoading,
    isSubmitting: submitMutation.isPending,
    error,
    isDynamicForm,

    // Form submission
    onSubmit,

    // Utility functions
    retryFetchContactForm: refetchForm,

    // Additional TanStack Query states
    isLoadingForm,
    isSubmittingForm: submitMutation.isPending,
    submitError: submitMutation.error?.message || null,
    isSuccess: submitMutation.isSuccess,
  };
};
