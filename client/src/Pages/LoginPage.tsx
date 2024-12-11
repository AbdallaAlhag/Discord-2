import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import { AuthLayout, AuthButton, AuthInput } from "../Components";
import axios from "axios";
import { useAuth } from "../AuthContext";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const { setUserId } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any existing errors

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      if (res.status === 200) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);
        setUserId(res.data.user.id);

        navigate("/", { replace: true });
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // const handleGuestLogin = () => {
  //   // Here you would handle guest login logic
  //   // console.log('Guest login attempted');
  //   axios
  //     .post(`${baseURL}/auth/login/guest`, {})
  //     // .post(`${baseURL}/auth/login/guest`, { username, password })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         // Successfully logged in
  //         // Assuming the server returns a token in the response
  //         const token = res.data.token;

  //         // Save token to localStorage
  //         localStorage.setItem("token", token); // Or use sessionStorage or cookies

  //         navigate("/", { replace: true });
  //       } else {
  //         setError("Guest login failed. Please try again.");
  //         console.log("Login failed");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("Login failed", err);
  //       setError("Guest login failed. Please try again.");
  //     });
  // };

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
            {error && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <AuthInput
                label="Email or Phone Number"
                type="text"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                autoComplete="email"
              />

              <AuthInput
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                autoComplete="current-password"
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
              Scan this with the Discord-2 mobile app to log in instantly.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
