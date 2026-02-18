'use client';

import { useSelector } from 'react-redux';

// Define interface for the user state to avoid using 'any'
interface UserState {
  customer: {
    name?: string;
    profile_image?: string;
    place?: string;
    customer_id?: string;
    email?: string;
    gender?: string;
    country_code?: string;
    dob?: string;
    // Use Record instead of index signature with any
    [key: string]: string | number | boolean | undefined;
  };
  loading: boolean;
  error: unknown;
}

// Define a minimal RootState interface
interface RootState {
  user: UserState;
}

export default function useProfileHeader() {
  // Access customer data from Redux store using the proper type
  const { customer, loading, error } = useSelector((state: RootState) => state.user);

  return {
    customer,
    loading,
    error,
  };
}
