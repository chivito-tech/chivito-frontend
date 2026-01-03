"use client";

import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { motion } from "framer-motion";

const serviceOptions = [
  { value: "Mechanic", label: "Mechanic" },
  { value: "Electrician", label: "Electrician" },
  { value: "Detailer", label: "Detailer" },
  { value: "Painter", label: "Painter" },
  { value: "Plumber", label: "Plumber" },
  { value: "Constructor", label: "Constructor" },
  { value: "Carpenter", label: "Carpenter" },
];

// Custom animated menu wrapper
const AnimatedMenu = (props: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <components.Menu {...props} />
    </motion.div>
  );
};

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
      components={{ Menu: AnimatedMenu }}
      className="w-full"
      classNames={{
        control: () =>
          "rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500",
        menu: () => "z-50",
      }}
      styles={{
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? "#7e22ce" : "#1f2937",
          backgroundColor: state.isFocused
            ? "rgba(126, 34, 206, 0.1)"
            : "white",
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          color: "#7e22ce",
        }),
        input: (styles) => ({
          ...styles,
          color: "#1f2937",
        }),
        placeholder: (styles) => ({
          ...styles,
          color: "#9ca3af",
        }),
      }}
    />
  );
}
