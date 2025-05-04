"use client";
import React from "react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  className = "",
  value,
  onChange,
  as = "input",
  children,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-200 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded bg-gray-800 border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${className}`}
          value={value}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void
          }
        />
      ) : as === "select" ? (
        <select
          id={name}
          name={name}
          required={required}
          className={`w-full rounded bg-gray-800 border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${className}`}
          value={value as string}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void
          }
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded bg-gray-800 border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white ${className}`}
          value={value}
          onChange={
            onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
          }
        />
      )}
    </div>
  );
};

export default FormField;
