import { useDispatch, UseDispatch } from "react-redux";
import { deleteAddress } from "@/store/slices/address";
import { AppDispatch } from "@/store/StoreProvider";
import { togglePopModal } from "@/store/slices/modal";

interface Props {
  
  addressId: string;
}


const Delete = ({addressId}: Props) => {
   const dispatch = useDispatch<AppDispatch>();

  const handleDelete = ()=>{
    dispatch(deleteAddress(addressId))
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800">Delete Confirmation</h2>
      <p className="mt-2 text-gray-600">Are you sure you want to delete?</p>
      
      <div className="mt-4 flex justify-end gap-3">
        <button 
           onClick={()=>dispatch(togglePopModal(false))}
          className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button 
         onClick={handleDelete}
          
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Delete
