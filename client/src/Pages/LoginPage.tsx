import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";
import { AuthLayout, AuthButton, AuthInput } from "../Components";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", formData);
  };

  return (
    <AuthLayout>
      <div className="flex gap-8 max-w-4xl w-full">
        <div className="flex-1">
          <div className="bg-[#2b2d31] p-8 rounded-lg shadow-xl w-full max-w-md">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-400 mb-6">
              We're so excited to see you again!
            </p>

            <form onSubmit={handleSubmit}>
              <AuthInput
                label="Email or Phone Number"
                type="text"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <AuthInput
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <a
                href="#"
                className="text-sm text-blue-500 hover:underline block mb-6"
              >
                Forgot your password?
              </a>

              <AuthButton type="submit">Log In</AuthButton>

              <p className="mt-4 text-sm text-gray-400">
                Need an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="hidden lg:block flex-1">
          <div className="bg-[#2b2d31] p-8 rounded-lg shadow-xl text-center">
            <QrCode className="w-64 h-64 mx-auto mb-6 text-white" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Log in with QR Code
            </h2>
            <p className="text-gray-400">
              Scan this with the Discord mobile app to log in instantly.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
