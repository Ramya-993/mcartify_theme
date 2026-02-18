"use client";
//@ts-check
import { updateAddress } from "@/store/slices/address";
import { AppDispatch } from "@/store/StoreProvider";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { AxiosFetcher } from "@/utils/axios";
import { toastError } from "@/utils/toastConfig";

interface Props {
  addressData: {
    firstName: string;
    lastName: string;
    flatNo: string;
    phoneNumber: string;
    postalCode: string;
    streetAddress: string;
    addressLine2: string;
    city: string;
    landmark: string;
    email: string;
    countryId: number;
    stateId: number;
    countryName: string;
    stateName: string;
  };
  addressId: number;
}

const EditAddress = ({ addressData, addressId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: addressData,
  });

  const [countries, setCountries] = useState<
    { countryId: number; countryName: string }[] | []
  >([]);
  const [states, setStates] = useState<
    { stateId: number; stateName: string; countryId: number }[] | []
  >([]);

  const countryId = watch("countryId");

  // Set initial country and state after data loads
  useEffect(() => {
    if (countries.length > 0 && addressData.countryId) {
      const countryExists = countries.some(
        (c) => c.countryId === addressData.countryId,
      );
      if (countryExists) {
        setValue("countryId", addressData.countryId);
      }
    }
  }, [countries, addressData.countryId, setValue]);

  useEffect(() => {
    if (states.length > 0 && addressData.stateId) {
      const stateExists = states.some((s) => s.stateId === addressData.stateId);
      if (stateExists) {
        setValue("stateId", addressData.stateId);
      }
    }
  }, [states, addressData.stateId, setValue]);

  useEffect(() => {
    const fetchAllCountry = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/countries`,
        );
        const res = await req.json();
        if (res.Status) {
          setCountries(res.Countries);
        }
      } catch (e) {
        console.log(e);
        setCountries([]);
      }
    };
    fetchAllCountry();
  }, []);

  useEffect(() => {
    const fetchState = async (country: number) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/states/${country}`,
        );
        const res = await req.json();
        if (res.Status) {
          setStates(res.States);
        }
      } catch (e) {
        console.log(e);
        setStates([]);
      }
    };
    if (countryId) {
      fetchState(countryId);
    }
  }, [countryId]);

  const onSubmit = async (data: typeof addressData) => {
    try {
      const response = await AxiosFetcher.post("/stores/check-location", {
        type: "phone",
        value: data.phoneNumber,
        countryId: 101,
      });

      if (response.data.Status !== 1) {
        toastError("Phone number did not match with country code");
        return;
      }

      const newResponse = await AxiosFetcher.post("/stores/check-location", {
        type: "pincode",
        value: data.postalCode,
        countryId: 101,
      });

      if (newResponse.data.Status !== 1) {
        toastError("Pincode did not match with country code");
        return;
      }

      dispatch(updateAddress({ addressData: data, addressId }));
    } catch (error: any) {
      console.error(error);
      toastError(
        error?.response?.data?.Message ||
          "Something went wrong. Please try again.",
      );
    }
  };
  return (
    <div className="px-2 py-8 md:px-24">
      <p className="text-xl">Edit address</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="firstName" className="text-xs">
            First Name
          </label>
          <input
            {...register("firstName", {
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "First name cannot exceed 50 characters",
              },
              pattern: {
                value: /^[A-Za-z\s'-]+$/,
                message:
                  "First name can only contain letters, spaces, hyphens, and apostrophes",
              },
            })}
            id="firstName"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="lastName" className="text-xs">
            Last Name
          </label>
          <input
            {...register("lastName", {
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Last name cannot exceed 50 characters",
              },
              pattern: {
                value: /^[A-Za-z\s'-]+$/,
                message:
                  "Last name can only contain letters, spaces, hyphens, and apostrophes",
              },
            })}
            id="lastName"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="phoneNumber" className="text-xs">
            Mobile
          </label>
          <input
            {...register("phoneNumber", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid mobile number (10 digits required)",
              },
              validate: {
                validNumber: (value) => {
                  const firstDigit = value.charAt(0);
                  return (
                    ["6", "7", "8", "9"].includes(firstDigit) ||
                    "Mobile number must start with 6, 7, 8, or 9"
                  );
                },
              },
            })}
            id="phoneNumber"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setValue("phoneNumber", value);
            }}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="email" className="text-xs">
            Email
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
              maxLength: {
                value: 100,
                message: "Email cannot exceed 100 characters",
              },
            })}
            id="email"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* House Name & Floor */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="flatNo" className="text-xs">
            House Name & Floor
          </label>
          <input
            {...register("flatNo", {
              required: "House name/floor is required",
              minLength: {
                value: 2,
                message: "House name/floor must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "House name/floor cannot exceed 100 characters",
              },
            })}
            id="flatNo"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.flatNo && (
            <p className="text-xs text-red-500">{errors.flatNo.message}</p>
          )}
        </div>

        {/* Street */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="streetAddress" className="text-xs">
            Street
          </label>
          <input
            {...register("streetAddress", {
              required: "Street address is required",
              minLength: {
                value: 5,
                message: "Street address must be at least 5 characters",
              },
              maxLength: {
                value: 200,
                message: "Street address cannot exceed 200 characters",
              },
            })}
            id="streetAddress"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.streetAddress && (
            <p className="text-xs text-red-500">
              {errors.streetAddress.message}
            </p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="addressLine2" className="text-xs">
            Address Line 2
          </label>
          <input
            {...register("addressLine2", {
              maxLength: {
                value: 200,
                message: "Address line 2 cannot exceed 200 characters",
              },
            })}
            id="addressLine2"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* City */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="city" className="text-xs">
            City
          </label>
          <input
            {...register("city", {
              required: "City is required",
              minLength: {
                value: 2,
                message: "City must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "City cannot exceed 50 characters",
              },
              pattern: {
                value: /^[A-Za-z\s'-]+$/,
                message:
                  "City can only contain letters, spaces, hyphens, and apostrophes",
              },
            })}
            id="city"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Landmark */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="landmark" className="text-xs">
            Landmark
          </label>
          <input
            {...register("landmark", {
              maxLength: {
                value: 100,
                message: "Landmark cannot exceed 100 characters",
              },
            })}
            id="landmark"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Country */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="countryId" className="text-xs">
            Country
          </label>
          <select
            {...register("countryId", {
              required: "Country is required",
              validate: (value: any) => value !== "" || "Please select a country",
            })}
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.countryId} value={country.countryId}>
                {country.countryName}
              </option>
            ))}
          </select>
          {errors.countryId && (
            <p className="text-xs text-red-500">{errors.countryId.message}</p>
          )}
        </div>

        {/* State */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="stateId" className="text-xs">
            State
          </label>
          <select
            {...register("stateId", {
              required: "State is required",
              validate: (value: any) => value !== "" || "Please select a state",
            })}
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.stateId} value={state.stateId}>
                {state.stateName}
              </option>
            ))}
          </select>
          {errors.stateId && (
            <p className="text-xs text-red-500">{errors.stateId.message}</p>
          )}
        </div>

        {/* Postal Code */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="postalCode" className="text-xs">
            Postal code
          </label>
          <input
            {...register("postalCode", {
              required: "Postal code is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Postal code must be exactly 6 digits",
              },
              validate: {
                validPincode: async (value) => {
                  try {
                    const response = await AxiosFetcher.post(
                      "/stores/check-location",
                      {
                        type: "pincode",
                        value: value,
                        countryId: 101,
                      },
                    );
                    return (
                      response.data.Status === 1 ||
                      "Invalid postal code for selected country"
                    );
                  } catch (error) {
                    return "Error validating postal code";
                  }
                },
              },
            })}
            id="postalCode"
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setValue("postalCode", value);
            }}
          />
          {errors.postalCode && (
            <p className="text-xs text-red-500">{errors.postalCode.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-white"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default EditAddress;
