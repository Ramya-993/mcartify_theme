"use client";

import { useEffect, useState } from "react";
import { AxiosFetcher } from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RefundAndCancellationPolicy() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRefundAndCancellationPolicy = async () => {
    try {
      const response = await AxiosFetcher.get("/stores/refund-policy");
      return response?.data;
    } catch (e) {
      setError(
        e?.response?.data?.Message ||
          "Failed to load refund and cancellation policy"
      );
      return e?.response?.data;
    }
  };

  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoading(true);
      try {
        const response = await getRefundAndCancellationPolicy();
        setData(response);
      } catch (error) {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data?.Status !== 1 || error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Refund and Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {data?.Message ||
                  error ||
                  "Something went wrong while loading the refund and cancellation policy."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {data?.Title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-slate max-w-none dark:prose-invert  wrap-anywhere"
            dangerouslySetInnerHTML={{ __html: data?.RefundPolicy }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
