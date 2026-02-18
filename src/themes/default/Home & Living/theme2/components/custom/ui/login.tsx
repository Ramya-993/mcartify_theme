"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginProps {
  storeImage?: string;
  storeName?: string;
}

const Login = ({ storeImage, storeName }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login with", email, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        {storeImage && (
          <div className="flex justify-center">
          <Image
            src={storeImage}
            alt={storeName || "Store"}
            width={80}
            height={80}
              className="rounded-full"
          />
          </div>
        )}
        <CardTitle className="text-2xl text-primary">
          {storeName || "Login"}
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            required
          />
        </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            required
          />
        </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
          <Button
            variant="link"
            className="text-primary p-0 h-auto"
              onClick={() => console.log("Register clicked")}
            >
              Register
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Login;
