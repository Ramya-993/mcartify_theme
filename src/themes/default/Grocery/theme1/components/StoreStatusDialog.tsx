"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface StoreStatusProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storeStatus: {
    reason?: string;
    resumeDate?: string;
    resumeTime?: string;
    pauseStartDate?: string;
    pauseStartTime?: string;
    storePaused?: boolean;
    enabled?: number;
  };
  isStoreOpen?: {
    isStoreOpenNow?: boolean;
    day?: string;
    from?: string;
    to?: string;
  };
}

const StoreStatusDialog: React.FC<StoreStatusProps> = ({
  isOpen,
  onOpenChange,
  storeStatus,
  isStoreOpen,
}) => {
  // Determine if store is closed due to business hours vs being paused
  const isClosedForBusinessHours =
    !isStoreOpen?.isStoreOpenNow && !storeStatus?.storePaused;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <div className="bg-red-50 p-4 border-b border-(color:--destructive)/20">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5" />
              {isClosedForBusinessHours
                ? "Store Currently Closed"
                : "Store Temporarily Unavailable"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Different content based on closure reason */}
            {isClosedForBusinessHours ? (
              <>
                {/* Business Hours Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Business Hours:
                  </h3>
                  <p className="text-sm mt-1">
                    We are currently closed. Please visit us during our business
                    hours.
                  </p>
                </div>

                {/* Current Day Info */}
                <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    Today&apos;s Hours ({isStoreOpen?.day})
                  </h3>
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-blue-800">
                      {isStoreOpen?.from} - {isStoreOpen?.to}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Store Paused Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Reason:
                  </h3>
                  <p className="text-sm mt-1">
                    {storeStatus?.reason ||
                      "The store is currently paused and not accepting orders."}
                  </p>
                </div>

                {/* Maintenance Schedule */}
                <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    Maintenance Schedule
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Started On:</p>
                      <p className="font-medium">
                        {storeStatus?.pauseStartDate ? (
                          <span>
                            {new Date(
                              storeStatus.pauseStartDate
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          "--"
                        )}
                      </p>
                      <p className="text-gray-600">
                        {storeStatus?.pauseStartTime ? (
                          <span>{storeStatus.pauseStartTime}</span>
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        Expected to Resume:
                      </p>
                      <p className="font-medium text-green-700">
                        {storeStatus?.resumeDate ? (
                          <span>
                            {new Date(
                              storeStatus.resumeDate
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        ) : (
                          "--"
                        )}
                      </p>
                      <p className="text-gray-600">
                        {storeStatus?.resumeTime ? (
                          <span>{storeStatus.resumeTime}</span>
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <p className="text-sm text-gray-600 italic">
              {isClosedForBusinessHours
                ? "Thank you for your understanding. We will be back during business hours!"
                : "We apologize for the inconvenience. Please check back later."}
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoreStatusDialog;
