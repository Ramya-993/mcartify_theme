"use client";
import { addNewAddress } from "@/store/slices/address";
import { AppDispatch } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toastError } from "@/utils/toastConfig";

interface AddressForm {
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
  countryId: string;
  stateId: string;
}

const AddAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressForm>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      flatNo: "",
      phoneNumber: "",
      postalCode: "",
      streetAddress: "",
      addressLine2: "",
      city: "",
      landmark: "",
      email: "",
      countryId: "",
      stateId: "",
    },
  });

  const [countries, setCountries] = useState<
    | {
        countryId: number;
        countryName: string;
      }[]
    | []
  >([]);
  const [states, setStates] = useState<
    | {
        stateId: number;
        stateName: string;
        countryId: number;
      }[]
    | []
  >([]);

  useEffect(() => {
    const fetchAllCountry = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/countries`
        );
        const res = await req.json();
        setCountries(res.Status ? res.Countries : []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAllCountry();
  }, []);

  useEffect(() => {
    const fetchState = async (country: string) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/states/${country}`
        );
        const res = await req.json();
        setStates(res.Status ? res.States : []);
      } catch (e) {
        console.log(e);
      }
    };
    const countryId = watch("countryId");
    if (countryId) fetchState(countryId);
  }, [watch("countryId")]);

  const onSubmit = async (data: AddressForm) => {
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

      dispatch(addNewAddress(data));
    } catch (error: any) {
      console.error(error);
      toastError(
        error?.response?.data?.Message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="px-2 py-8 md:px-24">
      <p className="text-xl">Add new address</p>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-screen">
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
            <span className="text-xs text-red-500">
              {errors.firstName.message}
            </span>
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
            <span className="text-xs text-red-500">
              {errors.lastName.message}
            </span>
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
            type="tel"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setValue("phoneNumber", value);
            }}
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && (
            <span className="text-xs text-red-500">
              {errors.phoneNumber.message}
            </span>
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
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        {/* Country */}
        <div className="mt-2 flex flex-col gap-1 p-1">
          <label htmlFor="countryId" className="text-xs">
            Country
          </label>
          <select
            {...register("countryId", {
              required: "Country is required",
              validate: (value) => value !== "" || "Please select a country",
            })}
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option value={country.countryId} key={country.countryId}>
                {country.countryName}
              </option>
            ))}
          </select>
          {errors.countryId && (
            <span className="text-xs text-red-500">
              {errors.countryId.message}
            </span>
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
              validate: (value) => value !== "" || "Please select a state",
            })}
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option value={state.stateId} key={state.stateId}>
                {state.stateName}
              </option>
            ))}
          </select>
          {errors.stateId && (
            <span className="text-xs text-red-500">
              {errors.stateId.message}
            </span>
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
                      }
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
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setValue("postalCode", value);
            }}
            className="rounded-lg border border-solid border-gray-300 bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postalCode && (
            <span className="text-xs text-red-500">
              {errors.postalCode.message}
            </span>
          )}
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
            <span className="text-xs text-red-500">{errors.city.message}</span>
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
            <span className="text-xs text-red-500">
              {errors.flatNo.message}
            </span>
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
            <span className="text-xs text-red-500">
              {errors.streetAddress.message}
            </span>
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

export default AddAddress;
