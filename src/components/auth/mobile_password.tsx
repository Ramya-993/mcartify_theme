"use client";

import { fetchCart } from "@/store/slices/cart";
import { togglePopModal } from "@/store/slices/modal";
import { login } from "@/store/slices/user";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toastError, toastSuccess } from "@/utils/toastConfig";

// Shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";

interface FormData {
  countryCode: string;
  phone: string;
  password: string;
}

const LoginWithMobileAndPassword = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { store } = useSelector((state: RootState) => state.store);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      countryCode: "+91",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    AxiosFetcher.post("/customer/login/phone", data)
      .then((res) => {
        if (res?.data?.Status) {
          dispatch(login(res.data.Token));
          localStorage.setItem("token", res.data.Token);
          dispatch(togglePopModal(false));
          toastSuccess("Login successful");
        } else {
          // Handle unsuccessful login
          toastError(res?.data?.Message || "Login failed");
        }
      })
      .then(() => {
        dispatch(fetchCart());
      })
      .catch((err) => {
        // Type narrowing for error object
        let errorMessage = "Error occurred";
        if (err && typeof err === 'object' && 'response' in err && 
            err.response && typeof err.response === 'object' && 'data' in err.response &&
            err.response.data && typeof err.response.data === 'object' && 'Message' in err.response.data) {
          errorMessage = String(err.response.data.Message) || errorMessage;
        }
        toastError(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const continueAsGuest = () => {
    const guest_token = localStorage.getItem("guest_token");
    if (guest_token) {
      dispatch(login(guest_token));
    } else {
      dispatch(fetchCart()).then(() => {
        const guest_token = localStorage.getItem("guest_token");
        dispatch(login(guest_token));
      });
    }
    dispatch(togglePopModal(false));
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 py-10"
        >
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-2xl font-medium">
              Groceries at your doorstep, in no time!
            </CardTitle>
          </CardHeader>

          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Phone className="h-4 w-4" />
              </div>
              <div className="absolute inset-y-0 left-9 flex items-center text-sm">
                +91
              </div>
              <Input
                id="phone"
                type="tel"
                className={`pl-16 ${errors.phone ? "border-destructive" : ""}`}
                placeholder="Enter 10-digit number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number (10 digits required)",
                  },
                  validate: {
                    onlyNumbers: (value) =>
                      /^\d+$/.test(value) ||
                      "Phone number should contain only numbers",
                  },
                })}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setValue("phone", value);
                }}
                value={watch("phone")}
              />
            </div>
            {errors.phone && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.phone.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type={passwordShown ? "text" : "password"}
                className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setPasswordShown(!passwordShown)}
              >
                {passwordShown ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {errors.password.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Button 
            type="submit" 
            className="mt-2 w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Continue"}
          </Button>

          <div className="flex justify-between gap-2 pt-2">
            {store?.loginTypes?.[0]?.allowGuest && (
              <Button
                type="button"
                variant="ghost"
                onClick={continueAsGuest}
                className="w-full text-blue-500"
                size="sm"
              >
                Continue as Guest
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                dispatch(togglePopModal(false));
                router.push("/sign-up");
              }}
              className="w-full text-blue-500"
              size="sm"
            >
              Sign up
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-2">
            By continuing you agree to our
            <br />
            <Link 
              href="/privacy-policy" 
              className="text-primary underline hover:text-primary/80"
            >
              Privacy Policy and Terms of Use
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginWithMobileAndPassword;
