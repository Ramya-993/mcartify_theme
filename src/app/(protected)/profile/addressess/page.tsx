"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AxiosFetcher } from "@/utils/axios";
import { toast } from "sonner";
import {
  addNewAddress,
  updateAddress,
  deleteAddress,
} from "@/store/slices/address";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { formatAddressWithoutName } from "@/utils/addressFormatter";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

// Zod Schema for Address Form
const addressSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  phoneNumber: z
    .string()
    .regex(
      /^[6789]\d{9}$/,
      "Invalid mobile number (10 digits, starting with 6,7,8, or 9)"
    ),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters"),
  streetAddress: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address cannot exceed 200 characters"),
  addressLine2: z
    .string()
    .max(200, "Address line 2 cannot exceed 200 characters")
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "City can only contain letters, spaces, hyphens, and apostrophes"
    ),
  postalCode: z
    .string()
    // .regex(/^\d{6}$/, "Postal code must be exactly 6 digits"),
    ,
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
});

// Types
type AddressForm = z.infer<typeof addressSchema>;

interface Country {
  countryId: number;
  countryName: string;
}

interface State {
  stateId: number;
  stateName: string;
  countryId: number;
}

interface Address {
  addressId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  postalCode: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  email: string;
  countryId: number;
  stateId: number;
  countryName: string;
  stateName: string;
}

// Delete Component
interface DeleteProps {
  addressId: string;
  onClose: () => void;
}

const DeleteAddress = ({ addressId, onClose }: DeleteProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = () => {
    dispatch(deleteAddress(addressId));
    toast.success("Address deleted successfully");
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Address</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </div>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Address Form Component (used for both Add and Edit)
interface AddressFormProps {
  addressData?: Address;
  addressId?: string;
  isEdit?: boolean;
  onClose: () => void;
}

const AddressFormComponent = ({
  addressData,
  addressId,
  isEdit = false,
  onClose,
}: AddressFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressData
      ? {
          firstName: addressData.firstName || "",
          lastName: addressData.lastName || "",
          phoneNumber: addressData.phoneNumber || "",
          postalCode: addressData.postalCode || "",
          streetAddress: addressData.streetAddress || "",
          addressLine2: addressData.addressLine2 || "",
          city: addressData.city || "",
          email: addressData.email || "",
          countryId: addressData.countryId
            ? addressData.countryId.toString()
            : "",
          stateId: addressData.stateId ? addressData.stateId.toString() : "",
        }
      : {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          postalCode: "",
          streetAddress: "",
          addressLine2: "",
          city: "",
          email: "",
          countryId: "",
          stateId: "",
        },
    mode: "onBlur",
  });

  const { watch, setValue } = form;
  const countryId = watch("countryId");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await AxiosFetcher.get("/stores/countries");
        if (response.data.Status) {
          setCountries(response.data.Countries);
        } else {
          toast.error("Failed to fetch countries");
        }
      } catch (error) {
        toast.error("Failed to fetch countries");
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryId) return;
      try {
        const response = await AxiosFetcher.get(`/stores/states/${countryId}`);
        if (response.data.Status) {
          setStates(response.data.States);
        } else {
          toast.error("Failed to fetch states");
        }
      } catch (error) {
        toast.error("Failed to fetch states");
      }
    };
    fetchStates();
  }, [countryId]);

  const onSubmit = async (data: AddressForm) => {
    try {
      const phoneResponse = await AxiosFetcher.post("/stores/check-location", {
        type: "phone",
        value: data.phoneNumber,
        countryId: 101,
      });

      if (phoneResponse.data.Status !== 1) {
        toast.error("Phone number did not match with country code");
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

      if (pincodeResponse.data.Status !== 1) {
        toast.error(pincodeResponse.data.Message || "Invalid pincode");
        return;
      }

      if (isEdit && addressId) {
        dispatch(updateAddress({ addressData: data, addressId }));
        toast.success("Address updated successfully");
      } else {
        dispatch(addNewAddress(data));
        toast.success("Address added successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.Message || "Something went wrong");
    }
  };

  return (
    <Card className="w-full max-w-2xl border-none shadow-none">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setValue("phoneNumber", value);
                      }}
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
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.countryId}
                          value={country.countryId.toString()}
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
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem
                          key={state.stateId}
                          value={state.stateId.toString()}
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
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          // .replace(/\D/g, "")
                          // .slice(0, 6);
                        setValue("postalCode", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Update Address" : "Add Address"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Main Addresses Component
const Addresses = () => {
  const { data: addresses } = useSelector((state: RootState) => state.address);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    address: Address | null;
  }>({
    open: false,
    address: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    addressId: string | null;
  }>({
    open: false,
    addressId: null,
  });

  return (
    <div className="container mx-auto p-4">
      {addresses?.length ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address: Address) => (
              <Card key={address.addressId}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center wrap-anywhere">
                    <span>
                      {address.firstName} {address.lastName}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          addressId: address.addressId,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="wrap-anywhere">
                    {formatAddressWithoutName(address)}
                  </CardDescription>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => setEditDialog({ open: true, address })}
                  >
                    Edit Address
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-6">Add New Address</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <AddressFormComponent onClose={() => setAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8">
          <CardTitle>No Addresses Found</CardTitle>
          <CardDescription>
            You haven't added any addresses yet.
          </CardDescription>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Add New Address</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <AddressFormComponent onClose={() => setAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </Card>
      )}

      {editDialog.open && editDialog.address && (
        <Dialog
          open={editDialog.open}
          onOpenChange={(open) =>
            setEditDialog({ open, address: editDialog.address })
          }
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <AddressFormComponent
              addressData={editDialog.address}
              addressId={editDialog.address.addressId}
              isEdit
              onClose={() => setEditDialog({ open: false, address: null })}
            />
          </DialogContent>
        </Dialog>
      )}

      {deleteDialog.open && deleteDialog.addressId && (
        <DeleteAddress
          addressId={deleteDialog.addressId}
          onClose={() => setDeleteDialog({ open: false, addressId: null })}
        />
      )}
    </div>
  );
};

export default Addresses;
