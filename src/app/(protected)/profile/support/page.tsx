
'use client'
import React,{useEffect} from "react";
import { RootState, AppDispatch } from "@/store/StoreProvider";
import {useDispatch,  useSelector } from "react-redux";
import { fetchContact } from "@/store/slices/contactInfo";


const Support = () => {

  const dispatch = useDispatch<AppDispatch>();
    const { contactInfo, loading, error } = useSelector((state: RootState) => state.contact);
  
     useEffect(() => {
        dispatch(fetchContact());
      }, [dispatch]);
  
  return (
    <div>
      {contactInfo &&
      <div className="flex text-xl rounded-lg bg-white p-6 shadow-sm">
        Contact us using the details below
      </div>}
      {loading && <div className="flex text-xl rounded-lg bg-white p-6 shadow-sm">
        Loading Contact Details
      </div> }
      {contactInfo &&
      <div className="mt-4 flex md:flex-row flex-col justify-around rounded-lg bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center py-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <span className="material-symbols-rounded !text-4xl">
              location_on
            </span>
          </div>
          <p className="text-center text-gray-800">
        
           
          {contactInfo?.address?.apartmentBuilding},{contactInfo?.address?.areaLocation} <br />
                  {contactInfo?.address?.stateCity},{contactInfo?.address?.country},{contactInfo?.address?.pincode}
          </p>
        </div>
        <div className="flex flex-col items-center py-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <span className="material-symbols-rounded !text-4xl">call</span>
          </div>
          <p className="text-center text-gray-800">
          {contactInfo?.phoneNumbers[1]} <br />
          {contactInfo?.phoneNumbers[2]}
          </p>
        </div>
        <div className="flex flex-col items-center py-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <span className="material-symbols-rounded !text-4xl">mail</span>
          </div>
          <p className="text-center text-gray-800">
          {contactInfo?.emailAddresses[1]} <br />
          {contactInfo?.emailAddresses[2]}
          </p>
        </div>
      </div>}
    </div>
  );
};

export default Support;
