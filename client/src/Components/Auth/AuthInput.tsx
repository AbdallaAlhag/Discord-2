import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2 bg-zinc-900 rounded border ${
          error ? "border-red-500" : "border-zinc-700"
        } text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
