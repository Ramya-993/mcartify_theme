"use client";

import { useState, useEffect } from "react";
import { MapPin, X, Globe, Navigation } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreData } from "@/types/store";

interface AddressPopUpProps {
  saveLocation: (name: string) => void;
  store: StoreData;
}

// Define form data type for different service location types
type FormData = {
  // For pincode type
  customerPincode?: string;
  // For latlng type
  latitude?: string;
  longitude?: string;
  // For anywhere type
  countryCode?: string;
  state?: string;
  // Common fields
  name?: string;
};

// Define response status type
type ResponseStatus = {
  message: string;
  isSuccess: boolean;
  isLoading: boolean;
};

// Country and State types
type Country = {
  code: string;
  countryName: string;
};

type State = {
  code: string;
  countryName: string;
  stateId: number;
  stateName: string;
};

const LocationForm: React.FC<AddressPopUpProps> = ({ saveLocation, store }) => {
  const dispatch = useDispatch<AppDispatch>();
  const serviceLocation = store?.ServiceLocation || {};
  const locationType = serviceLocation.type || "pincode";
  console.log("serviceLocationinLoginForm", serviceLocation);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus>({
    message: "",
    isSuccess: false,
    isLoading: false,
  });

  const getDefaultValues = () => {
    switch (locationType) {
      case "anywhere":
        return {
          countryCode: "",
          state: "",
        };
      case "latlng":
        return {
          latitude: "",
          longitude: "",
        };
      case "pincode":
      default:
        return {
          customerPincode: "",
        };
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: getDefaultValues(),
  });

  // Fetch countries for anywhere type
  const fetchCountries = async () => {
    if (locationType !== "anywhere") return;

    setLoadingCountries(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("guest_token");
      console.log("token in countries", token);

      const response = await AxiosFetcher.get("/user/countryCodes", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Countries API response:", response);
      console.log("Countries API response data:", response?.data);
      console.log("Countries API response Status:", response?.data?.Status);
      console.log(
        "Countries API response Countries:",
        response?.data?.Countries
      );

      if (response?.data?.Status === 1 && response?.data?.Countries) {
        console.log("Setting countries:", response.data.Countries);
        setCountries(response.data.Countries);
      } else {
        console.log(
          "Countries API response condition failed - Status:",
          response?.data?.Status,
          "Countries:",
          response?.data?.Countries
        );
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch states for selected country
  const fetchStates = async (countryCodes: string[]) => {
    if (locationType !== "anywhere" || !countryCodes.length) return;

    setLoadingStates(true);
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("guest_token");
      console.log("token in states", token);
      const response = await AxiosFetcher.post(
        "/user/states",
        {
          codes: countryCodes,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("States API response:", response);
      console.log("States API response data:", response?.data);
      console.log("States API response Status:", response?.data?.Status);
      console.log("States API response Data:", response?.data?.Data);
      console.log("States API response States:", response?.data?.States);

      if (response?.data?.Status === 1 && response?.data?.States) {
        console.log("Setting states:", response.data.States);
        setStates(response.data.States);
      } else {
        console.log(
          "States API response condition failed - Status:",
          response?.data?.Status,
          "Data:",
          response?.data?.Data,
          "States:",
          response?.data?.States
        );
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  // Handle country selection
  const handleCountryChange = (countryCode: string) => {
    setValue("countryCode", countryCode);
    setValue("state", ""); // Reset state when country changes
    setStates([]); // Clear states
    if (countryCode) {
      fetchStates([countryCode]);
    }
  };

  // Get current location for latlng type
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setResponseStatus({
        message: "Getting your location...",
        isSuccess: false,
        isLoading: true,
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position in getCurrentLocation", position);
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          setValue("latitude", lat);
          setValue("longitude", lng);
          setResponseStatus({
            message: "Location detected successfully!",
            isSuccess: true,
            isLoading: false,
          });
        },
        () => {
          setResponseStatus({
            message: "Unable to get your location. Please enter manually.",
            isSuccess: false,
            isLoading: false,
          });
        }
      );
    } else {
      setResponseStatus({
        message: "Geolocation is not supported by this browser.",
        isSuccess: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [locationType]);

  const onSubmit = async (data: FormData) => {
    setResponseStatus({
      message: "",
      isSuccess: false,
      isLoading: true,
    });

    setIsSubmitted(true);
    setSubmittedData(data);

    // Prepare payload based on location type
    const payload: Record<string, string> = { type: locationType };

    switch (locationType) {
      case "anywhere":
        payload.countryCode = data.countryCode || "IN";
        if (data.state) {
          payload.state = data.state;
        }
        break;
      case "latlng":
        if (data.latitude) payload.latitude = data.latitude;
        if (data.longitude) payload.longitude = data.longitude;
        break;
      case "pincode":
      default:
        if (data.customerPincode) 
          payload.customerPincode = data.customerPincode;
        break;
    }

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      const response = await AxiosFetcher.post(
        "/stores/check-service-location",
        payload,
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
          message: response?.data?.Message || "Location Verified Successfully",
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
      let errorMessage = "Error occurred";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "Message" in err.response.data
      ) {
        errorMessage = String(err.response.data.Message) || errorMessage;
      }

      setResponseStatus({
        message: errorMessage,
        isSuccess: false,
        isLoading: false,
      });
    }
  };

  const getFormTitle = () => {
    switch (locationType) {
      case "anywhere":
        return "Select Location";
      case "latlng":
        return "Share Location";
      case "pincode":
      default:
        return "Check Availability";
    }
  };

  const getFormDescription = () => {
    switch (locationType) {
      case "anywhere":
        return "Select your country and state to check service availability";
      case "latlng":
        return "Share your location coordinates to check service availability";
      case "pincode":
      default:
        return "Enter your pincode to check item availability in your area";
    }
  };

  const getFormIcon = () => {
    switch (locationType) {
      case "anywhere":
        return <Globe className="w-6 h-6 text-primary" />;
      case "latlng":
        return <Navigation className="w-6 h-6 text-primary" />;
      case "pincode":
      default:
        return <MapPin className="w-6 h-6 text-primary" />;
    }
  };

  const renderFormFields = () => {
    switch (locationType) {
      case "anywhere":
        return (
          <>
            {/* Country Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Country *
              </label>
              <Controller
                name="countryCode"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={handleCountryChange}
                    disabled={loadingCountries || responseStatus.isLoading}
                  >
                    <SelectTrigger
                      className={errors.countryCode ? "border-destructive" : ""}
                      onClick={(e) => {
                        // Prevent event bubbling to modal's click-away handler
                        e.stopPropagation();
                      }}
                    >
                      <SelectValue
                        placeholder={
                          loadingCountries
                            ? "Loading countries..."
                            : countries.length > 0
                            ? "Select Country"
                            : "No countries available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      onCloseAutoFocus={(e) => {
                        // Prevent modal from closing when dropdown closes
                        e.preventDefault();
                      }}
                      className="z-[99999]"
                    >
                      {countries.length > 0 ? (
                        countries.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={country.code}
                            onClick={(e) => {
                              // Prevent event bubbling
                              e.stopPropagation();
                            }}
                          >
                            {country.countryName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="IN" disabled>
                          {loadingCountries
                            ? "Loading..."
                            : "No countries available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* State Selection (Optional) */}
            {watch("countryCode") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  State (Optional)
                </label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingStates || responseStatus.isLoading}
                    >
                      <SelectTrigger
                        onClick={(e) => {
                          // Prevent event bubbling to modal's click-away handler
                          e.stopPropagation();
                        }}
                      >
                        <SelectValue
                          placeholder={
                            loadingStates
                              ? "Loading states..."
                              : states.length > 0
                              ? "Select State (Optional)"
                              : "No states available"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        onCloseAutoFocus={(e) => {
                          // Prevent modal from closing when dropdown closes
                          e.preventDefault();
                        }}
                        className="z-[99999]"
                      >
                        {states.length > 0 ? (
                          states.map((state) => (
                            <SelectItem
                              key={state.code || state.stateName}
                              value={state.stateName}
                              onClick={(e) => {
                                // Prevent event bubbling
                                e.stopPropagation();
                              }}
                            >
                              {state.stateName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            {loadingStates
                              ? "Loading..."
                              : "No states available"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </>
        );

      case "latlng":
        return (
          <>
            {/* Latitude Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Latitude *
              </label>
              <Controller
                name="latitude"
                control={control}
                rules={{
                  required: "Latitude is required",
                  pattern: {
                    value: /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/,
                    message: "Invalid latitude format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Latitude"
                    className={errors.latitude ? "border-destructive" : ""}
                    disabled={responseStatus.isLoading}
                  />
                )}
              />
            </div>

            {/* Longitude Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Longitude *
              </label>
              <Controller
                name="longitude"
                control={control}
                rules={{
                  required: "Longitude is required",
                  pattern: {
                    value:
                      /^-?([1-9]?[0-9]\.{1}\d{1,6}$|1[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$)/,
                    message: "Invalid longitude format",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Longitude"
                    className={errors.longitude ? "border-destructive" : ""}
                    disabled={responseStatus.isLoading}
                  />
                )}
              />
            </div>

            {/* Get Current Location Button */}
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="w-full"
              disabled={responseStatus.isLoading}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Current Location
            </Button>
          </>
        );

      case "pincode":
      default:
        return (
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
        );
    }
  };

  const renderErrors = () => {
    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return null;

    return (
      <Alert variant="destructive" className="py-2">
        <AlertDescription>
          {errorFields.map((field) => (
            <div key={field}>{errors[field as keyof FormData]?.message}</div>
          ))}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card
      className="w-full  "
      onClick={(e) => {
        // Prevent card clicks from bubbling to modal
        e.stopPropagation();
      }}
    >
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          {getFormIcon()}
        </div>
        <CardTitle>{getFormTitle()}</CardTitle>
        <CardDescription>{getFormDescription()}</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          onClick={(e) => {
            // Prevent form clicks from bubbling to modal
            e.stopPropagation();
          }}
        >
          {renderFormFields()}

          {/* Error messages */}
          {renderErrors()}

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
            {locationType === "pincode" && (
              <p className="text-muted-foreground">
                Pincode:{" "}
                <span className="font-medium text-foreground">
                  {submittedData.customerPincode}
                </span>
              </p>
            )}
            {locationType === "latlng" && (
              <div className="text-muted-foreground space-y-1">
                <p>
                  Latitude:{" "}
                  <span className="font-medium text-foreground">
                    {submittedData.latitude}
                  </span>
                </p>
                <p>
                  Longitude:{" "}
                  <span className="font-medium text-foreground">
                    {submittedData.longitude}
                  </span>
                </p>
              </div>
            )}
            {locationType === "anywhere" && (
              <div className="text-muted-foreground space-y-1">
                <p>
                  Country:{" "}
                  <span className="font-medium text-foreground">
                    {countries.find((c) => c.code === submittedData.countryCode)
                      ?.countryName || submittedData.countryCode}
                  </span>
                </p>
                {submittedData.state && (
                  <p>
                    State:{" "}
                    <span className="font-medium text-foreground">
                      {submittedData.state}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationForm;
