"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

const serviceOptions = [
  { value: "Mechanic", label: "Mechanic" },
  { value: "Electrician", label: "Electrician" },
  { value: "Detailer", label: "Detailer" },
  { value: "Painter", label: "Painter" },
  { value: "Plumber", label: "Plumber" },
  { value: "Constructor", label: "Constructor" },
  { value: "Carpenter", label: "Carpenter" },
];

export default function ServiceSelect({
  onChange,
}: {
  onChange: (value: any) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Select
      options={serviceOptions}
      isMulti
      placeholder="Search services..."
      onChange={onChange}
      className="w-full"
      classNames={{
        control: () =>
          "rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500",
        menu: () => "z-50",
      }}
      styles={{
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? "#7e22ce" : "#1f2937", // purple for selected, gray-800 otherwise
          backgroundColor: state.isFocused
            ? "rgba(126, 34, 206, 0.1)"
            : "white",
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: "#7e22ce", // purple text inside selected tags
        }),
        input: (styles) => ({
          ...styles,
          color: "#1f2937", // gray-800 text when typing
        }),
        placeholder: (styles) => ({
          ...styles,
          color: "#9ca3af", // gray-400 for placeholder
        }),
      }}
    />
  );
}
