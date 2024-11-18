import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, AuthButton, AuthInput } from "../Components";
import axios from "axios";

const profilePictures = import.meta.glob("../assets/defaultPfp/*.png", {
  eager: true,
}) as Record<string, { default: string }>;

// Extract all the default exports into an array
const profilePictureArray: string[] = Object.values(profilePictures).map(
  (module) => module.default
);

// Generate a random profile picture
const randomIndex = Math.floor(Math.random() * profilePictureArray.length);
const randomProfilePicture: string = profilePictureArray[randomIndex];

// console.log("Random profile picture: ", randomProfilePicture);

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    month: "",
    day: "",
    year: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any existing errors

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const date = new Date(`${formData.year}-${formData.month}-${formData.day}`);
    if (date.getTime() > Date.now() - 1000 * 60 * 60 * 24 * 365 * 13) {
      setError("You must be at least 13 years old to register");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // could have combine these two lol
      const res = await axios.post(`${baseURL}/auth/register`, {
        username,
        email,
        password,
        confirmPassword,
      });

      if (res.status === 200) {
        // generate random pfp and save it to the database
        try {
          await axios.post(`${baseURL}/auth/pfp/${email}`, {
            pfp: randomProfilePicture,
          });
        } catch (err) {
          console.error("Error saving profile picture:", err);
        }
        navigate("/login", { replace: true });
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "Sign-up failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="bg-[#2b2d31] p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6">
            Create an account
          </h1>
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
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <AuthInput
              label="Username"
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              autoComplete="username"
            />

            <AuthInput
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              autoComplete="new-password"
            />
            <AuthInput
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              autoComplete="new-password"
            />

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  className="bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({ ...formData, month: e.target.value })
                  }
                  required
                >
                  <option value="">Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  className="bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.day}
                  onChange={(e) =>
                    setFormData({ ...formData, day: e.target.value })
                  }
                  required
                >
                  <option value="">Day</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <select
                  className="bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  required
                >
                  <option value="">Year</option>
                  {[...Array(100)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <AuthButton type="submit">Continue</AuthButton>

            <p className="mt-4 text-sm text-gray-400">
              By registering, you agree to Discord-2's{" "}
              <a className="text-blue-500 hover:underline cursor-pointer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-blue-500 hover:underline cursor-pointer">
                Privacy Policy
              </a>
              .
            </p>

            <p className="mt-4 text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
