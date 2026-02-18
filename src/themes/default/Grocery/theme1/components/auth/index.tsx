"use client";

import React from "react";
import LoginModal from "./LoginModal";

// Re-export LoginModal as both Login and LoginModal for backward compatibility
const Login = (props: { storeImage: string; storeName: string }) => {
  return <LoginModal {...props} asComponent={true} />;
};

// Export both for different use cases
export default Login;
export { LoginModal };

// Export additional auth components
export { default as ForgotPassword } from "./forgot_password";
export { default as ResetPassword } from "./reset_password";
export { default as ChangePassword } from "./change_password";
