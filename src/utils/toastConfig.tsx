'use client'
import { toast, ToastOptions, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Store to keep track of active toasts
const activeToasts = new Set<string>();

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Generate unique ID based on message and type
const getToastId = (message: string, type: TypeOptions) => {
  return `${type}-${message}`;
};

export const showToast = (
  type: TypeOptions,
  message: string,
  options?: ToastOptions
) => {
  const toastId = getToastId(message, type);
  
  if (!activeToasts.has(toastId)) {
    activeToasts.add(toastId);
    
    toast(message, {
      ...defaultOptions,
      ...options,
      type,
      toastId,
      onClose: () => activeToasts.delete(toastId),
    });
  }
};

// Individual methods for different toast types
export const toastError = (message: string, options?: ToastOptions) => 
  showToast('error', message, options);

export const toastSuccess = (message: string, options?: ToastOptions) => 
  showToast('success', message, options);

export const toastWarning = (message: string, options?: ToastOptions) => 
  showToast('warning', message, options);

export const toastInfo = (message: string, options?: ToastOptions) => 
  showToast('info', message, options);