"use client";

import {
  changeAddressIndex,
  deleteAddress,
  addNewAddress,
  fetchAddress,
  updateAddress,
} from "@/store/slices/address";
import { fetchCart } from "@/store/slices/cart";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";

import { formatAddress } from "@/utils/addressFormatter";
import { AxiosFetcher } from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastInfo, toastError, toastSuccess } from "@/utils/toastConfig";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, TrashIcon } from "lucide-react";
import Image from "next/image";
import { CouponIcon, LocationIcon } from "@/components/icons";

// Zod schema for address form validation
const addressFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "First name cannot exceed 20 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Last name cannot exceed 20 characters"),
  companyName: z
    .string()
    .max(20, "Company name cannot exceed 20 characters")
    .optional(),
  streetAddress: z
    .string()
    .min(1, "Street address is required")
    .max(40, "Street address cannot exceed 40 characters"),
  addressLine2: z
    .string()
    .max(40, "Address line 2 cannot exceed 40 characters")
    .optional(),
  city: z
    .string()
    .min(1, "City is required")
    .max(20, "City cannot exceed 20 characters"),
  stateId: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  // .regex(/^[0-9]{6}$/, "Invalid ZIP Code (6 digits required)"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)"),
  email: z
    .string()
    .min(1, "Email is required")
    .max(30, "Email cannot exceed 30 characters")
    .email("Invalid email address"),
  countryId: z.string().min(1, "Country is required"),
});

type FormValues = z.infer<typeof addressFormSchema>;

interface AddressType {
  addressId: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  stateId: number;
  postalCode: string;
  phoneNumber: string;
  email: string;
  countryId: number;
  stateName?: string;
  countryName?: string;
}

// Import the separate CouponSidebar component
import CouponSidebar from "./CouponSidebar";

const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { promocodeAllowed, store } = useSelector(
    (state: RootState) => state.store
  );

  console.log("promocodeAllowed", promocodeAllowed);
  console.log("storeName", store?.storeName);

  const tncRef = useRef(null);
  const router = useRouter();
  console.log(
    "process.env.NEXT_PUBLIC_ENVIRONMENT",
    process.env.NEXT_PUBLIC_ENVIRONMENT
  );

  // Validate environment configuration
  if (!process.env.NEXT_PUBLIC_ENVIRONMENT) {
    console.warn("NEXT_PUBLIC_ENVIRONMENT is not set, defaulting to LOCAL");
  }
  const [paymentData, setPaymentData] = useState<
    Array<{
      mode: string;
      gateway: string;
      apiKey: string;
      desc: string;
    }>
  >([]);

  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");

  const [privacyError, setPrivacyError] = useState<null | string>(null);
  const [showShippingForm, setShowShippingForm] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(
    null
  );
  const [countries, setCountries] = useState<
    | {
        countryId: number;
        countryName: string;
      }[]
    | []
  >([]);

  // Coupon sidebar state
  const [showCouponSidebar, setShowCouponSidebar] = useState<boolean>(false);

  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { data: addresses, defaultAddressIndex } = useSelector(
    (state: RootState) => state.address
  );

  // Calculate correct values according to the formulas
  const subTotal = cart
    ? (cart.OriginalPrice || 0) - (cart.TotalItemDiscount || 0)
    : 0;
  const totalPriceAfterPromocode = subTotal - (cart?.PromocodeDiscount || 0);
  const finalPrice = totalPriceAfterPromocode + (cart?.VAT || 0);
  const finalPriceWithShipping = finalPrice + (cart?.ShippingCharges || 0);

  useEffect(() => {
    const fetchAllCountry = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/countries`
        );
        const res = await req.json();
        if (res.Status) {
          setCountries(res.Countries);
        } else {
          setCountries([]);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchAllCountry();
  }, []);

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(fetchAddress());
  }, [dispatch]);

  const deletePromocode = () => {
    if (cart?.PromocodeDiscount) {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;
      AxiosFetcher.delete("/stores/promocode/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }).then(() => {
        toastSuccess("Promocode removed");
        dispatch(fetchCart());
      });
    }
  };

  const handleOrder = async () => {
    console.log("clicked");

    // @ts-expect-error - tncRef.current is possibly null but we check it below
    if (tncRef.current && !tncRef.current.checked) {
      setPrivacyError("please accept terms and conditions");
      return;
    }

    if (!addresses?.[defaultAddressIndex]?.addressId) {
      toastInfo(
        "Address is needed for delivery. Please select or add an address"
      );
      return;
    }

    console.log("Processing order with selected address");
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("guest_token") ||
      null;

    // Handle online payment flow
    if (selectedPaymentMode === "online") {
      try {
        const onlinePayment = paymentData.find(
          (item) => item.mode === "online"
        );

        if (!onlinePayment) {
          toastError("Online payment method not found");
          return;
        }

        // Store selected address ID for later use in payment status page
        localStorage.setItem(
          "selectedAddressId",
          addresses?.[defaultAddressIndex]?.addressId || ""
        );

        // Step 1: Create payment using /stores/payment/create API
        const paymentPayload = {
          shippingType: 1,
          addressId: addresses?.[defaultAddressIndex]?.addressId,
          gateway: onlinePayment.gateway,
          return_url: `${window.location.origin}/payment-status`,
          notify_url: `${window.location.origin}/api/payment/webhook`,
        };

        const paymentResponse = await AxiosFetcher.post(
          "/stores/payment/create",
          paymentPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (!paymentResponse.data.Status) {
          console.error("Payment creation failed:", paymentResponse.data);
          toastError(
            paymentResponse.data.Message || "Failed to create payment"
          );
          return;
        }

        // Process payment response
        const paymentDetails = paymentResponse.data.PaymentDetails;
        console.log("Payment details received:", paymentDetails);
        console.log("Payment gateway:", onlinePayment.gateway);

        if (onlinePayment.gateway === "razorpay") {
          const options = {
            key: onlinePayment.apiKey,
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            name: store?.storeName || "MCartify",
            description: "Order Payment",
            order_id: paymentDetails.id,
            handler: async function () {
              // Step 2: After successful payment, place order with v2 API
              try {
                const placeOrderPayload = {
                  addressId: addresses?.[defaultAddressIndex]?.addressId,
                  shippingType: 1,
                  paymentOrderId: paymentDetails.id,
                };

                const orderResponse = await AxiosFetcher.post(
                  "/stores/v2/order/create",
                  placeOrderPayload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                  }
                );
                console.log("Order response:", orderResponse.data);

                if (orderResponse.data.Status) {
                  dispatch(fetchCart());
                  router.replace(
                    `order-success?orderId=${orderResponse.data.OrderID}`
                  );
                } else {
                  toastError(
                    orderResponse.data.Message || "Failed to place order"
                  );
                  router.replace(
                    `/payment-failed?reason=${encodeURIComponent(
                      orderResponse.data.Message || "Order creation failed"
                    )}&orderId=${paymentDetails.id}`
                  );
                }
              } catch (error: unknown) {
                const err = error as {
                  response?: { data?: { Message?: string } };
                };
                console.error("Error placing order:", error);
                toastError(
                  err?.response?.data?.Message ||
                    "Error occurred while placing order"
                );
                router.replace(
                  `/payment-failed?reason=${encodeURIComponent(
                    err?.response?.data?.Message || "Order creation failed"
                  )}&orderId=${paymentDetails.id}`
                );
              }
            },
            modal: {
              ondismiss: () => {
                router.replace(
                  `/payment-failed?reason=Payment+dismissed&orderId=${paymentDetails.id}`
                );
              },
              onerror: () => {
                router.replace(
                  `/payment-failed?reason=Payment+error&orderId=${paymentDetails.id}`
                );
              },
            },
            prefill: {
              name: `${addresses?.[defaultAddressIndex]?.firstName} ${addresses?.[defaultAddressIndex]?.lastName}`,
              email: addresses?.[defaultAddressIndex]?.email,
              contact: addresses?.[defaultAddressIndex]?.phoneNumber,
            },
            notes: paymentDetails.notes,
            theme: {
              color: "#10b981", // emerald-600 color
            },
          };

          const rzp = new (
            window as unknown as {
              Razorpay: new (options: unknown) => { open: () => void };
            }
          ).Razorpay(options);
          rzp.open();
        } else if (onlinePayment.gateway === "cashfree") {
          // Process Cashfree payment - Implementation based on official docs
          const cashfreeGlobal = (window as unknown as { Cashfree?: unknown })
            .Cashfree;

          if (!cashfreeGlobal) {
            toastError("Cashfree payment gateway not loaded");
            return;
          }

          // Extract payment session information
          const sessionId =
            paymentDetails.payment_session_id || paymentDetails.session_id;
          const orderId = paymentDetails.order_id || paymentDetails.cf_order_id;

          console.log(
            "paymentDetailsdasdsdsad",
            paymentDetails.payment_session_id
          );
          console.log(
            "Raw payment details:",
            JSON.stringify(paymentDetails, null, 2)
          );
          console.log("Extracted session ID:", sessionId);
          console.log("Session ID length:", sessionId?.length);
          console.log("Session ID type:", typeof sessionId);

          if (!sessionId) {
            console.error(
              "Payment session ID not found in payment details:",
              paymentDetails
            );
            toastError("Payment session not found");
            return;
          }

          // Validate session ID format
          if (typeof sessionId !== "string" || sessionId.length < 10) {
            console.error("Invalid session ID format:", sessionId);
            toastError("Invalid payment session format");
            return;
          }

          console.log("Cashfree session ID:", sessionId);
          console.log("Cashfree order ID:", orderId);

          try {
            // Initialize Cashfree SDK as per official documentation
            const CashfreeConstructor = cashfreeGlobal as (config: {
              mode: string;
            }) => {
              checkout: (options: {
                paymentSessionId: string;
                redirectTarget: string;
              }) => void;
            };

            const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
            const cashfree = CashfreeConstructor({
              mode: mode,
            });

            // Setup checkout options
            const checkoutOptions = {
              paymentSessionId: sessionId,
              redirectTarget: "_self",
            };

            console.log("Checkout options:", checkoutOptions);

            // Open Cashfree checkout - this will redirect to payment page
            cashfree.checkout(checkoutOptions);

            console.log("Cashfree checkout initiated successfully");
          } catch (error: unknown) {
            const err = error as Error;
            console.error("Cashfree payment error:", err);
            console.error("Error details:", {
              message: err.message,
              stack: err.stack,
              sessionId,
              orderId,
              mode:
                process.env.NEXT_PUBLIC_ENVIRONMENT === "LOCAL"
                  ? "sandbox"
                  : "production",
            });
            toastError(`Cashfree payment error: ${err.message}`);
            router.replace(
              `/payment-failed?reason=${encodeURIComponent(
                err.message
              )}&orderId=${orderId}`
            );
          }
        } else {
          toastError("Unsupported payment gateway");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { Message?: string } } };
        console.error("Payment error:", error);
        toastError(
          err?.response?.data?.Message ||
            "Error occurred during payment process"
        );
      }
    } else {
      // Handle COD payment flow (existing flow)
      const orderObject = {
        addressId: addresses?.[defaultAddressIndex]?.addressId,
        paymentType: 1, // COD
        shippingType: 1,
        gateway: "cod",
      };

      AxiosFetcher.post("/stores/order/create", orderObject, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
        .then((r) => {
          if (r.data.Status) {
            dispatch(fetchCart());
            router.replace(`order-success?orderId=${r.data.Order.OrderId}`);
          } else {
            throw new Error(r.data.Message || "Failed to place order");
          }
        })
        .catch((err) => {
          toastError(err?.response?.data?.Message || "Error occurred");
        });
    }
  };

  const fetchPayment = async () => {
    const token =
      localStorage.getItem("guest_token") ||
      localStorage.getItem("token") ||
      null;
    try {
      const response = await AxiosFetcher.get("/stores/payment-integrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.Status) {
        console.log(response?.data);
        setPaymentData(response?.data?.PaymentIntegrations);
        setSelectedPaymentMode(response?.data?.PaymentIntegrations[0]?.mode);
      } else {
        throw new Error(response.data.Message);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  // Add New Address Form Component
  const AddressFormComponent = ({
    isEdit = false,
    addressData = null,
    onClose,
  }: {
    isEdit?: boolean;
    addressData?: AddressType | null;
    onClose: () => void;
  }) => {
    const form = useForm<FormValues>({
      resolver: zodResolver(addressFormSchema),
      defaultValues: addressData
        ? {
            firstName: addressData.firstName || "",
            lastName: addressData.lastName || "",
            companyName: addressData.companyName || "",
            streetAddress: addressData.streetAddress || "",
            addressLine2: addressData.addressLine2 || "",
            city: addressData.city || "",
            postalCode: addressData.postalCode || "",
            phoneNumber: addressData.phoneNumber || "",
            email: addressData.email || "",
            countryId: addressData.countryId
              ? addressData.countryId.toString()
              : "",
            stateId: addressData.stateId ? addressData.stateId.toString() : "",
          }
        : {
            firstName: "",
            lastName: "",
            companyName: "",
            streetAddress: "",
            addressLine2: "",
            city: "",
            postalCode: "",
            phoneNumber: "",
            email: "",
            countryId: "",
            stateId: "",
          },
    });

    // Local states management for this form component
    const [states, setStates] = useState<
      | {
          stateId: number;
          stateName: string;
          countryId: number;
        }[]
      | []
    >([]);

    // Function to fetch states when country changes
    const handleCountryChange = async (countryId: string) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/states/${countryId}`
        );
        const res = await req.json();
        if (res.Status) {
          setStates(res.States);
        } else {
          setStates([]);
        }
      } catch (e) {
        console.log(e);
        setStates([]);
      }
    };

    // Fetch states when form loads in edit mode
    useEffect(() => {
      if (isEdit && addressData?.countryId) {
        handleCountryChange(addressData.countryId.toString());
      }
    }, [isEdit, addressData?.countryId]);

    const onAddressSubmit = async (data: FormValues) => {
      try {
        // Validate phone and pincode
        const phoneResponse = await AxiosFetcher.post(
          "/stores/check-location",
          {
            type: "phone",
            value: data.phoneNumber,
            countryId: 101,
          }
        );

        if (phoneResponse?.data?.Status !== 1) {
          toastError("Phone number did not match with country code");
          return;
        }

        const pincodeResponse = await AxiosFetcher.post(
          "/stores/check-location",
          {
            type: "pincode",
            value: data.postalCode,
            countryId: 101,
          }
        );

        if (pincodeResponse?.data?.Status !== 1) {
          toastError("Pincode did not match with country code");
          return;
        }

        if (isEdit && addressData?.addressId) {
          // Update existing address
          await dispatch(
            updateAddress({
              addressData: data,
              addressId: addressData.addressId,
            })
          );

          // Refetch addresses
          await dispatch(fetchAddress());

          // Add updated address to cart if it's currently selected
          const currentAddressIndex = addresses?.findIndex(
            (addr: AddressType) => addr.addressId === addressData.addressId
          );
          if (currentAddressIndex === defaultAddressIndex) {
            await addAddressToCart(addressData.addressId.toString());
          }

          // toastSuccess("Address updated successfully");
        } else {
          // Add new address
          await dispatch(addNewAddress(data));

          // Refetch addresses
          const updatedAddresses = await dispatch(fetchAddress());

          // Auto-select the newly added address (last one in the list)
          if (updatedAddresses.payload?.Addresses?.length > 0) {
            const newAddressIndex =
              updatedAddresses.payload.Addresses.length - 1;
            const newAddress =
              updatedAddresses.payload.Addresses[newAddressIndex];

            // Set the new address as selected
            dispatch(changeAddressIndex(newAddressIndex));

            // Add the new address to cart
            if (newAddress?.addressId) {
              await addAddressToCart(newAddress.addressId.toString());
            }
          }

          // toastSuccess("Address added successfully");
        }

        // Close dialog and reset form
        onClose();
        form.reset();
      } catch (error: unknown) {
        const err = error as { response?: { data?: { Message?: string } } };
        toastError(
          err?.response?.data?.Message ||
            `Failed to ${isEdit ? "update" : "add"} address`
        );
      }
    };

    return (
      <Form {...form}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-(family-name:--font-secondary)">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="font-(family-name:--font-secondary) shadow-none"
                      placeholder="Enter first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="font-(family-name:--font-secondary) shadow-none"
                      placeholder="Enter last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  Company Name (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-(family-name:--font-secondary) shadow-none"
                    placeholder="Enter company name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  Country
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset state field when country changes
                    form.setValue("stateId", "");
                    // Fetch states for the selected country
                    handleCountryChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        value={country.countryId.toString()}
                        key={country.countryId}
                      >
                        {country.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-(family-name:--font-secondary) shadow-none"
                    placeholder="House number and street name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  Address Line 2 (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-(family-name:--font-secondary) shadow-none"
                    placeholder="Apartment, suite, unit, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  Town / City
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-(family-name:--font-secondary) shadow-none"
                    placeholder="Enter city"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  State
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem
                        value={state.stateId.toString()}
                        key={state.stateId}
                      >
                        {state.stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                  ZIP Code
                </FormLabel>
                <FormControl>
                  <Input
                    className="font-(family-name:--font-secondary) shadow-none"
                    placeholder="Enter ZIP code"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // .replace(/\D/g, "")
                      // .slice(0, 6);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="font-(family-name:--font-secondary) shadow-none"
                      placeholder="Enter phone number"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-(family-name:--font-secondary) font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="font-(family-name:--font-secondary) shadow-none"
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="font-(family-name:--font-secondary) shadow-none"
              onClick={() => {
                onClose();
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-(color:--primary) hover:bg-(color:--primary-hover) font-(family-name:--font-secondary) shadow-none"
              onClick={form.handleSubmit(onAddressSubmit)}
            >
              {isEdit ? "Update Address" : "Add Address"}
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      // Load Cashfree checkout script - Official SDK URL from docs
      const cashfreeScript = document.createElement("script");
      cashfreeScript.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      cashfreeScript.id = "cashfree-js";
      document.body.appendChild(cashfreeScript);
    }
  }, []);

  // Add address to cart API call
  const addAddressToCart = async (addressId: string) => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;

      const response = await AxiosFetcher.post(
        `/stores/cart/address`,
        {
          addressId: parseInt(addressId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.Status) {
        console.log("Address added to cart successfully");
        dispatch(fetchCart());
      } else {
        console.error("Failed to add address to cart:", response.data.Message);
        toastError(
          response.data.Message || "Failed to update delivery address"
        );
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { Message?: string } } };
      console.error(
        "Error adding address to cart:",
        err?.response?.data?.Message
      );
      toastError(
        err?.response?.data?.Message || "Error updating delivery address"
      );
    }
  };

  // Return normal checkout for logged-in users
  return (
    <div>
      <div>
        <div className="container mx-auto max-w-7xl ">
          <div className="mx-auto max-w-6xl py-4 px-4 lg:px-0">
            <h1 className="text-3xl font-bold text-gray-900 font-(family-name:--font-secondary)">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOrder();
        }}
      >
        <section className="container mx-auto flex flex-col px-2 md:mt-4 md:mb-4 md:max-w-6xl md:flex-row md:gap-10">
          <div className="h-fit w-full border-none shadow-none  px-10 py-6 md:w-3/5">
            <div>
              {/* Show address form when showShippingForm is true OR when editing */}
              {showShippingForm || editingAddress ? (
                <div className="mt-4">
                  <h3 className="text-lg font-(family-name:--font-secondary) font-bold mb-4">
                    {editingAddress ? "Edit Address" : "Shipping Information"}
                  </h3>
                  <AddressFormComponent
                    isEdit={!!editingAddress}
                    addressData={editingAddress}
                    onClose={() => {
                      setShowShippingForm(false);
                      setEditingAddress(null);
                    }}
                  />
                </div>
              ) : (
                <>
                  {addresses && addresses?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-(family-name:--font-secondary) font-bold mb-4">
                        Choose Address
                      </h3>
                      <div className="space-y-4">
                        {addresses &&
                          addresses.map((address: AddressType, i: number) => {
                            return (
                              <div
                                onClick={async (e) => {
                                  e.preventDefault();
                                  dispatch(changeAddressIndex(i));
                                  // Add address to cart when selected
                                  await addAddressToCart(address.addressId);
                                }}
                                key={address.addressId}
                                className={`group relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                                  i === defaultAddressIndex
                                    ? "border-(color:--primary) bg-(color:--primary)/10 shadow-md"
                                    : "border-gray-200 bg-white hover:border-(color:--secondary) hover:bg-(color:--secondary)"
                                }`}
                              >
                                {/* Selection indicator - LEFT TOP CORNER EDGE */}
                                <div
                                  className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    i === defaultAddressIndex
                                      ? "bg-(color:--secondary) border-(color:--secondary)"
                                      : "bg-white border-gray-300 group-hover:border-(color:--primary)"
                                  }`}
                                >
                                  {i === defaultAddressIndex && (
                                    <svg
                                      className="w-4 h-4 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <div className="flex items-start gap-4 pr-8 pl-12">
                                  {/* Location icon */}
                                  <div className="flex-shrink-0">
                                    <LocationIcon className="w-5 h-5 text-gray-500" />
                                  </div>

                                  <div className="flex-grow min-w-0">
                                    {/* Name with enhanced typography */}
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-(family-name:--font-secondary) text-gray-900 font-bold text-lg leading-tight">
                                        {address.firstName}{" "}
                                        {address?.lastName || ""}
                                      </h4>
                                      {i === defaultAddressIndex && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-(color:--secondary)/10 text-(color:--secondary)">
                                          Selected
                                        </span>
                                      )}
                                    </div>

                                    {/* Company name if available */}
                                    {address.companyName && (
                                      <p className="text-sm font-(family-name:--font-primary) text-gray-500 mb-1">
                                        {address.companyName}
                                      </p>
                                    )}

                                    {/* Address with better formatting */}
                                    <p className="text-sm font-(family-name:--font-primary) text-gray-700 leading-relaxed mb-2">
                                      {formatAddress(address)}
                                    </p>

                                    {/* Contact info */}
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <svg
                                          className="w-3 h-3"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        {address.phoneNumber}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <svg
                                          className="w-3 h-3"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        {address.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Action buttons - TOP RIGHT CORNER */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 ">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingAddress(address);
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Address"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        deleteAddress(address.addressId)
                                      );
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Address"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-600 font-bold mb-3 font-(family-name:--font-secondary) ">
                          Can&apos;t find the correct address?
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowShippingForm(!showShippingForm);
                          }}
                          className="bg-(color:--primary) hover:bg-(color:--primary-hover) text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Address
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show Add Address button when no addresses exist */}
                  {(!addresses || addresses?.length === 0) && (
                    <div className="mt-4">
                      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          No Addresses Found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Add an address to continue with checkout
                        </p>
                        <Button
                          type="button"
                          className="flex items-center gap-2 bg-(color:--primary) hover:bg-(color:--primary-hover)"
                          onClick={() => setShowShippingForm(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Add New Address
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="h-fit w-full border border-gray-200 bg-white rounded-lg shadow-sm px-6 py-6 md:w-2/5">
            <h3 className="text-lg font-(family-name:--font-secondary) font-bold text-gray-900 mb-4">
              Order Details
            </h3>
            {/* Product Items */}
            <div className="space-y-4 mb-6">
              {cart?.CartItems &&
                cart?.CartItems.map((item: ICartItem) => (
                  <div
                    key={item.variantId}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-(family-name:--font-secondary) font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-(family-name:--font-primary)">
                        {item.qty && item.unit
                          ? `${item.qty} ${item.unit}`
                          : ""}{" "}
                        x {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-(family-name:--font-secondary) font-semibold text-gray-900">
                      {cart?.Currency}
                      {item.finalItemPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
            {/* Apply Coupon Section - Only show if promocodeAllowed is 1 */}
            {promocodeAllowed === 1 && (
              <div className="mb-6">
                {!cart?.PromocodeDiscount ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCouponSidebar(true);
                      }}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <CouponIcon className="h-4 w-4" />
                        <span className="text-sm font-(family-name:--font-secondary) font-medium text-gray-700">
                          Apply Coupon
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm font-medium text-green-700">
                          Coupon Applied: {cart?.Promocode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          deletePromocode();
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Bill Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Bill summary
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-(family-name:--font-secondary)">
                    MRP Total
                  </span>
                  <span className="text-gray-900 font-(family-name:--font-secondary) font-semibold">
                    {cart?.Currency}
                    {cart?.OriginalPrice.toFixed(2)}
                  </span>
                </div>

                {cart?.TotalItemDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-(family-name:--font-secondary)">
                      Product Discount
                    </span>
                    <span className="text-green-600 font-(family-name:--font-secondary)">
                      -{cart?.Currency}
                      {cart?.TotalItemDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {cart?.PromocodeDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-(family-name:--font-secondary)">
                      Coupon Discount
                    </span>
                    <span className="text-green-600 font-(family-name:--font-secondary)">
                      -{cart?.Currency}
                      {cart?.PromocodeDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 font-(family-name:--font-secondary)">
                    Delivery Fee
                  </span>
                  <span className="text-gray-900 font-(family-name:--font-secondary) font-semibold">
                    {cart?.ShippingCharges > 0
                      ? `${cart?.Currency}${cart?.ShippingCharges.toFixed(2)}`
                      : "Free"}
                  </span>
                </div>
                {cart?.VAT > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-(family-name:--font-secondary)">
                      Tax
                    </span>
                    <span className="text-gray-900 font-(family-name:--font-secondary) font-semibold">
                      {cart?.Currency}
                      {cart?.VAT.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900 font-(family-name:--font-secondary)">
                    Total
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                      {cart?.Currency}
                      {finalPriceWithShipping.toFixed(2)}
                    </div>
                    {(cart?.TotalItemDiscount > 0 ||
                      cart?.PromocodeDiscount > 0) && (
                      <div className="text-xs text-green-600 font-(family-name:--font-secondary)">
                        You Saved {cart?.Currency}
                        {(
                          (cart?.TotalItemDiscount || 0) +
                          (cart?.PromocodeDiscount || 0)
                        ).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {paymentData.length > 0 &&
                paymentData.map((paymentMethod: unknown, index) => {
                  const typedPaymentMethod = paymentMethod as {
                    gateway: string;
                    mode: string;
                    desc: string;
                  };
                  return (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={typedPaymentMethod.gateway}
                        className="flex items-center gap-3 font-semibold text-emerald-600 font-(family-name:--font-secondary)"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="-mb-0.5"
                          id={typedPaymentMethod.mode}
                          checked={
                            typedPaymentMethod.mode == selectedPaymentMode
                          }
                          onChange={({ target: { value } }) => {
                            setSelectedPaymentMode(value);
                          }}
                          value={typedPaymentMethod.mode}
                        />
                        {typedPaymentMethod.mode == "cod"
                          ? "Cash on Delivery"
                          : "Pay Now"}
                      </label>
                      <div
                        className={`mt-2 grid grid-cols-1 overflow-hidden transition-all ${
                          selectedPaymentMode == typedPaymentMethod.mode
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                        }`}
                      >
                        <p className="overflow-hidden text-xs text-gray-500">
                          {typedPaymentMethod.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>{" "}
            {/* Place Order Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 px-6 font-(family-name:--font-secondary) rounded-lg text-base font-semibold bg-(color:--primary) hover:bg-(color:--primary-hover) text-white transition-colors"
              >
                Place Order
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xs font-(family-name:--font-secondary) text-gray-600">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <Link
                  href={"/privacy-policy"}
                  className={
                    "text-blue-600 hover:underline font-(family-name:--font-secondary)"
                  }
                >
                  privacy policy.
                </Link>
              </p>
            </div>
            <div className="mt-4 flex items-start gap-2">
              <input
                type="checkbox"
                name="condition"
                id="condition"
                className="mt-0.5 accent-emerald-600"
                ref={tncRef}
              />
              <label
                htmlFor="condition"
                className="text-xs text-gray-600 font-(family-name:--font-secondary)"
              >
                I have read and agree to the website{" "}
                <Link
                  href={"/terms-and-conditions"}
                  className="text-blue-600 hover:underline font-(family-name:--font-secondary)"
                >
                  terms and conditions
                </Link>
              </label>
            </div>
            {privacyError && (
              <p className="text-xs text-red-500 font-(family-name:--font-secondary)">
                {privacyError}
              </p>
            )}
          </div>
        </section>
      </form>

      {/* Coupon Sidebar */}
      <CouponSidebar
        isOpen={showCouponSidebar}
        onClose={() => setShowCouponSidebar(false)}
      />
    </div>
  );
};

export default Checkout;
