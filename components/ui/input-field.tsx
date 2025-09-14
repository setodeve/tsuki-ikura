"use client";

import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
  error?: string;
}

export function InputField({
  label,
  suffix,
  error,
  id,
  ...props
}: InputFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="number"
          min="0"
          max="24"
          step="0.5"
          className={`
            w-full rounded-lg border px-3 py-2 text-sm
            focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
            ${
              props.readOnly
                ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                : ""
            }
          `}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
