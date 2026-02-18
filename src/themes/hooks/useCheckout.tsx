// useCheckout.tsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { changeAddressIndex, deleteAddress } from "@/store/slices/address";
import { fetchCart } from "@/store/slices/cart";

import { AxiosFetcher } from "@/utils/axios";
import { toastError, toastInfo, toastSuccess } from "@/utils/toastConfig";
import ICartItem from "@/types/cartItem";

interface FormValues {
  firstName: string;
  lastName: string;

  companyName?: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  stateId: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  countryId: string;
}

export const useCheckout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const tncRef = useRef<HTMLInputElement>(null);

  const [choosenFromSavedAddress, setChoosenFromSavedAddress] = useState(false);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [checkoutData, setCheckoutData] = useState({});
  const [couponCode, setCouponCode] = useState<string>("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>("");

  const [couponShowing, setCouponShowing] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<null | string>(null);
  const [privacyError, setPrivacyError] = useState<null | string>(null);

  const [shippingToNewAddress, setShippingToNewAddress] =
    useState<boolean>(false);
  const [countries, setCountries] = useState<
    { countryId: number; countryName: string }[]
  >([]);
  const [states, setStates] = useState<
    { stateId: number; stateName: string; countryId: number }[]
  >([]);

  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { data: addresses, defaultAddressIndex } = useSelector(
    (state: RootState) => state.address
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormValues>({ defaultValues: checkoutData });

  const countryId = watch("countryId");
  // Fetch countries
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

  // Fetch states based on country
  useEffect(() => {
    const fetchState = async (country: string) => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/stores/states/${country}`
        );
        const res = await req.json();
        if (res.Status) {
          setStates(res.States);
        } else {
          setStates([]);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (countryCode) {
      fetchState(countryCode);
    }
  }, [countryCode]);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  // Fetch payment methods
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await AxiosFetcher.get("/stores/payment-integrations");
        if (response.data.Status) {
          setPaymentData(response.data.PaymentIntegrations);
          setSelectedPaymentMode(response.data.PaymentIntegrations[0]?.mode);
        } else {
          throw new Error(response.data.Message);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };
    fetchPayment();
  }, []);

  // Update choosenFromSavedAddress based on shippingToNewAddress
  useEffect(() => {
    if (shippingToNewAddress) {
      setChoosenFromSavedAddress(false);
    }
  }, [shippingToNewAddress]);

  // Handle form input changes
  const handleChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCheckoutData((state) => ({ ...state, [name]: value }));
  };

  // Apply coupon code

  const applyCoupon = () => {
    const guest_token = localStorage.getItem("guest_token") || null;

    if (!couponCode) {
      toastInfo("please enter valid coupon code");
      return;
    }
    AxiosFetcher.post(
      "/stores/promocode/apply",
      { promocode: couponCode.toUpperCase() },
      {
        headers: { Authorization: `Bearer ${guest_token}` },
        withCredentials: true,
      }
    ).then((res) => {
      toastSuccess(res?.data?.Message || "Coupon applied successfully!");
    });
  };
  // Remove coupon code
  const deletePromocode = () => {
    if (cart?.PromocodeDiscount) {
      const guest_token = localStorage.getItem("guest_token") || null;
      AxiosFetcher.delete("/stores/promocode/remove", {
        headers: { Authorization: `Bearer ${guest_token}` },
        withCredentials: true,
      }).then((res) => {
        toastSuccess("Promocode removed");
        dispatch(fetchCart());
      });
    }
  };
  // Handle order submission
  const handleOrder = async (addressObject: FormValues) => {
    if (tncRef.current && !tncRef.current.checked) {
      setPrivacyError("please accept terms and conditions");
      return;
    }
    if (
      !addresses?.[defaultAddressIndex]?.addressId &&
      Object.keys(addressObject).length === 0
    ) {
      toastInfo(
        "Address is needed for delivery. Either select from your saved address or enter your details"
      );
      return;
    }
    if (shippingToNewAddress) {
      try {
        const response = await AxiosFetcher.post("/stores/check-location", {
          type: "phone",
          value: addressObject.phoneNumber,
          countryId: 101,
        });
        if (response?.data?.Status !== 1) {
          toastError("Phone number did not match with country code");
          return;
        }
        const newResponse = await AxiosFetcher.post("/stores/check-location", {
          type: "pincode",
          value: addressObject.postalCode,
          countryId: 101,
        });
        if (newResponse?.data?.Status !== 1) {
          toastError("Pincode did not match with country code");
          return;
        }
      } catch (error: any) {
        toastError(
          error?.response?.data?.Message ||
            "Something went wrong. Please try again."
        );
        return;
      }
    }
    const guest_token =
      localStorage.getItem("token") ||
      localStorage.getItem("guest_token") ||
      null;
    const orderObject: any = {
      address: addressObject,
      addressId: addresses?.[defaultAddressIndex]?.addressId,
      paymentType: selectedPaymentMode === "cod" ? 1 : 2,
      shippingType: 1,
    };
    if (selectedPaymentMode === "online") {
      const onlinePayment: any = paymentData.find(
        (item: any) => item.mode === "online"
      );
      orderObject.gateway = onlinePayment.gateway;
    } else {
      orderObject.gateway = "cod";
    }
    AxiosFetcher.post("/stores/order/create", orderObject, {
      headers: { Authorization: `Bearer ${guest_token}` },
      withCredentials: true,
    })
      .then((r) => {
        if (r.data.Status) {
          dispatch(fetchCart());
          if (r.data?.PaymentDetails?.id) {
            const options = {
              key: paymentData[1]?.apiKey,
              name: "My Company Pvt Ltd",
              description: "Test Transaction",
              order_id: r.data?.PaymentDetails?.id,
              handler: function (response: any) {
                router.replace(`order-success?orderId=${r.data.Order.OrderId}`);
              },
              prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9000090000",
              },
              notes: { address: "Test Address" },
              theme: { color: "#F37254" },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
          }
          if (selectedPaymentMode === "cod") {
            router.replace(`order-success?orderId=${r.data.Order.OrderId}`);
          }
        } else {
          throw new Error(r.data);
        }
      })
      .catch((err) => {
        toastError(err?.response?.data?.Message || "Error occurred");
      });
  };
  return {
    cart,
    addresses,
    defaultAddressIndex,
    shippingToNewAddress,
    choosenFromSavedAddress,
    couponShowing,
    couponCode,
    paymentData,
    selectedPaymentMode,
    privacyError,
    countries,
    states,
    errors,
    register,
    handleSubmit,
    setValue,
    control,
    countryId,
    tncRef,
    setCouponShowing,
    setCouponCode,
    setSelectedPaymentMode,
    setShippingToNewAddress,
    setCountryCode,
    handleChange,
    applyCoupon,
    deletePromocode,
    handleOrder,
    dispatch,
    changeAddressIndex,
    deleteAddress,
  };
};
