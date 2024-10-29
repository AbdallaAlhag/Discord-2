import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout, AuthButton, AuthInput } from "../Components";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    username: "",
    password: "",
    month: "",
    day: "",
    year: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Register:", formData);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="bg-[#2b2d31] p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6">
            Create an account
          </h1>

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
              label="Display Name"
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
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
              By registering, you agree to Discord's{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
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
