import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosFetcher } from "@/utils/axios";
import { toastError, toastSuccess } from "@/utils/toastConfig";

interface SignupFormData {
  name: string;
  countryCode: string;
  phone: string;
  areaPincode: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const response = await AxiosFetcher.post("/customer/signup", data);
      
      if (response.data.Status) {
        toastSuccess("Account creation successful. Please login to continue.");
        router.replace("/");
      } else {
        toastError(response.data.Message || "Error creating account");
      }
    } catch (error: unknown) {
      // Type guard for axios error response
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response && 
          error.response.data && typeof error.response.data === 'object' && 'Message' in error.response.data) {
        toastError(error.response.data.Message as string);
      } else {
        toastError("Error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
};
