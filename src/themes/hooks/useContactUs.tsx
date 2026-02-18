import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { fetchContact } from "@/store/slices/contactInfo";
import Contact from "@/types/contact";
import { AxiosFetcher } from "@/utils/axios";
import { toastSuccess, toastError } from "@/utils/toastConfig";

export const useContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Contact>();

  const dispatch = useDispatch<AppDispatch>();
  const { contactInfo, loading, error } = useSelector(
    (state: RootState) => state.contact
  );

  useEffect(() => {
    // Only fetch contact info if not already loaded and not loading
    if (!contactInfo && !loading) {
      dispatch(fetchContact());
    }
  }, [dispatch, contactInfo, loading]);

  // Use fallback contact info when there's an error
  useEffect(() => {
    if (error && !contactInfo) {
      // dispatch(setFallbackContactInfo());
    }
  }, [error, contactInfo, dispatch]);

  const onSubmit = async (data: Contact) => {
    try {
      const response = await AxiosFetcher.post("/stores/contactUs", data);
      if (response?.data?.Status === 1) {
        toastSuccess("Message sent successfully!");
        reset({});
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { Message?: string } } };
      toastError(
        error?.response?.data?.Message || "Error occurred while sending message"
      );
    }
  };

  // Function to handle manual retry
  const retryFetchContactInfo = () => {
    dispatch(fetchContact());
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    contactInfo,
    loading,
    error,
    retryFetchContactInfo,
  };
};
