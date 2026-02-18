# Forgot Password Workflow Implementation

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Environment Configuration
NEXT_PUBLIC_ENVIRONMENT=LOCAL

# API Configuration
NEXT_PUBLIC_BASE_URL=https://xapi.mcartify.com
```

### Payment Gateway Configuration

The application uses different payment gateway modes based on the environment:

- **LOCAL**: Uses sandbox mode for testing
- **PRODUCTION**: Uses production mode for live payments

**Important**: Ensure `NEXT_PUBLIC_ENVIRONMENT=LOCAL` is set for development to use sandbox payment gateways.

## Overview

I have successfully implemented a comprehensive forgot password workflow for the authentication system with the following components:

## New Components Created

### 1. `forgot_password.tsx`

- Handles both email and mobile forgot password requests
- Supports the API endpoint: `POST /customer/forgotPassword`
- Accepts either `email` or `mobile` in the request body
- Provides a seamless transition to the reset password form

### 2. `reset_password.tsx`

- Handles password reset with new password and confirmation
- Uses the API endpoint: `POST /customer/resetPassword`
- Requires `password` and `confirmPassword` in the request body
- Auto-logs in the user after successful password reset

### 3. `change_password.tsx`

- Allows logged-in users to change their password
- Uses the API endpoint: `POST /customer/changePassword`
- Requires `password`, `newPassword`, and `confirmNewPassword`
- Includes validation to ensure new password is different from current

## New Page Created

### `/reset-password` Page

- **Location**: `src/app/reset-password/page.tsx`
- **Purpose**: Handles password reset from email/SMS links
- **URL Format**: `/reset-password?token=<JWT_TOKEN>`
- **Features**:
  - Extracts token from URL parameters
  - Validates token presence
  - Shows error page for invalid/missing tokens
  - Integrates with the dynamic theme system
  - Responsive design with proper loading states
  - SEO optimized with proper metadata

## Integration Details

### Updated Components

#### `email_pass.tsx`

- Added "Forgot Password?" link that triggers the forgot password flow
- Integrated with `ForgotPassword` component in email mode
- Maintains existing login functionality

#### `mobile_password.tsx`

- Added "Forgot Password?" link for mobile password authentication
- Integrated with `ForgotPassword` component in mobile mode
- Removed unused `continueAsGuest` function to clean up code

#### `index.tsx`

- Added exports for all new auth components:
  - `ForgotPassword`
  - `ResetPassword`
  - `ChangePassword`

### Navbar.tsx

- Fixed duplicate `store: StoreData` parameter issue
- Maintained all existing functionality

## API Endpoints Used

1. **Forgot Password**

   ```
   POST: /customer/forgotPassword
   Body: { email: string } OR { mobile: string }
   ```

2. **Reset Password**

   ```
   POST: /customer/resetPassword
   Body: { password: string, confirmPassword: string }
   Headers: { Authorization: "Bearer <token>" }
   ```

3. **Change Password**
   ```
   POST: /customer/changePassword
   Body: { password: string, newPassword: string, confirmNewPassword: string }
   Headers: { Authorization: "Bearer <token>" }
   ```

## Features

- ✅ Email-based forgot password
- ✅ Mobile-based forgot password
- ✅ Password reset with token validation
- ✅ Change password for authenticated users
- ✅ Form validation with Zod schemas
- ✅ Error handling and success notifications
- ✅ Responsive UI with proper UX flow
- ✅ Integration with existing login modals
- ✅ Auto-login after successful password reset
- ✅ Dedicated reset password page (`/reset-password`)
- ✅ URL token parameter validation
- ✅ SEO optimized with proper metadata

## Usage

### For Email Login

Users can click "Forgot Password?" on the email login form to:

1. Enter their email address
2. Receive reset instructions via email
3. Click the reset link (opens `/reset-password?token=...`)
4. Enter new password and confirmation
5. Get automatically logged in

### For Mobile Login

Users can click "Forgot Password?" on the mobile login form to:

1. Enter their mobile number
2. Receive reset instructions via SMS
3. Click the reset link (opens `/reset-password?token=...`)
4. Enter new password and confirmation
5. Get automatically logged in

### For Logged-in Users

The `ChangePassword` component can be used in user profile/settings pages to allow password changes.

## Error Handling

- All components include comprehensive error handling
- Toast notifications for success/error states
- Form validation with helpful error messages
- Network error handling with fallback messages

The implementation maintains backward compatibility and follows the existing code patterns and styling conventions.
