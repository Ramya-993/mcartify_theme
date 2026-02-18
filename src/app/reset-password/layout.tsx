import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Mcartify",
  description: "Reset your password securely",
  robots: "noindex, nofollow", // Prevent search engines from indexing this page
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
