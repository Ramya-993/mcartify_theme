"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { AxiosFetcher } from "@/utils/axios";
import { AppDispatch } from "@/store/StoreProvider";
import { useDispatch } from "react-redux";
import { updatePopModalData, togglePopModal } from "@/store/slices/modal";
import { fetchCustomer } from "@/store/slices/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddressPopUpProps {
  saveLocation: (name: string) => void;
}

// Define form data type
type FormData = {
  customerPincode: string;
  name: string;
  latitude: string;
  longitude: string;
};

// Define response status type

// Response status type
type ResponseStatus = {
  message: string;
  isSuccess: boolean;
  isLoading: boolean;
};

const LocationForm: React.FC<AddressPopUpProps> = ({ saveLocation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>({
    message: "",
    isSuccess: false,
    isLoading: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      customerPincode: "",
      name: "",
      latitude: "",
      longitude: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setResponseStatus({
      message: "",
      isSuccess: false,
      isLoading: true,
    });

    setIsSubmitted(true);
    setSubmittedData(data);
    const newdata = { type: "pincode", ...data };

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      const response = await AxiosFetcher.post(
        "/stores/check-service-location",
        newdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.Status === 1) {
        saveLocation(response?.data?.Location);
        dispatch(fetchCustomer());

        setResponseStatus({
          message: response?.data?.Message || "Pincode Verified Successfully",
          isSuccess: true,
          isLoading: false,
        });

        dispatch(
          updatePopModalData({
            content: null,
            width: "max-w-xl",
          })
        );
        dispatch(togglePopModal(false));
      } else {
        setResponseStatus({
          message: response?.data?.Message || "Verification failed",
          isSuccess: false,
          isLoading: false,
        });
      }
    } catch (err: unknown) {
      // Type narrowing for the error object
      let errorMessage = "Error occurred";
      if (err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 'data' in err.response &&
          err.response.data && typeof err.response.data === 'object' && 'Message' in err.response.data) {
        errorMessage = String(err.response.data.Message) || errorMessage;
      }
      
      setResponseStatus({
        message: errorMessage,
        isSuccess: false,
        isLoading: false,
      });
    }
  };



  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Check Availability</CardTitle>
        <CardDescription>
          Enter your pincode to check item availability in your area
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Controller
              name="customerPincode"
              control={control}
              rules={{
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{5,10}$/,
                  message: "Invalid pincode format",
                },
              }}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Pincode"
                    className={
                      errors.customerPincode ? "border-destructive" : ""
                    }
                    maxLength={10}
                    disabled={responseStatus.isLoading}
                  />
                  {watch("customerPincode") && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => reset({ ...watch(), customerPincode: "" })}
                      disabled={responseStatus.isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            />
          </div>

          {/* Error messages */}
          {errors.customerPincode && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>
                {errors.customerPincode.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Response status message */}
          {responseStatus.message && (
            <Alert
              variant={responseStatus.isSuccess ? "default" : "destructive"}
              className="py-2"
            >
              <AlertDescription>{responseStatus.message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={responseStatus.isLoading}
          >
            {responseStatus.isLoading ? "Checking..." : "Submit"}
          </Button>
        </form>

        {/* Results area (shows after submission) */}
        {isSubmitted && submittedData && !responseStatus.message && (
          <div className="mt-4 p-4 rounded-lg border bg-muted">
            <p className="font-medium mb-2">Checking availability for:</p>
            <p className="text-muted-foreground">
              Pincode:{" "}
              <span className="font-medium text-foreground">
                {submittedData.customerPincode}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationForm;
