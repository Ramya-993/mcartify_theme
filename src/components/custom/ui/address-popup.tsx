import React, { useState } from "react";
import { toast } from "react-toastify";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AddressPopUpProps {
  saveLocation: (name: string) => void;
}

import { AxiosFetcher } from "@/utils/axios";

const AddressPopUp: React.FC<AddressPopUpProps> = ({ saveLocation }) => {
  const [error, setError] = useState<string | null>(null);
  const [myString, setMyString] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value.length <= 6) {
        setMyString(value);
        setError(null); // Clear error if input is valid
      } else {
        setError("Pincode must be exactly 6 digits");
      }
    }
  };

  const handleSubmit = async () => {
    if (myString.length !== 6) {
      setError("Pincode must be exactly 6 digits");
      return;
    }

    try {
      const response = await AxiosFetcher.post(
        "/stores/check-service-location",
        {
          customerPincode: myString,
        }
      );
      if (response?.data?.Status == 1) {
        saveLocation(response?.data?.Location);
        toastSuccess("Pincode Verified Successfully");
      }
    } catch (err: any) {
      toastError(err?.response?.data?.Message || "Error occurred");
    }
  };

  return (
    <Card className="absolute top-10 -left-30 md:left-0 w-[250px] z-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Verify Delivery Pincode</CardTitle>
        <CardDescription>Enter your delivery pincode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter pincode"
              value={myString}
              onChange={handleChange}
              maxLength={6}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressPopUp;
