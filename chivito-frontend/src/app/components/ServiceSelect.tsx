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

  if (!mounted) return null; // prevent SSR mismatch

  return (
    <Select
      options={serviceOptions}
      isMulti
      placeholder="Search services..."
      className="w-full"
      classNames={{
        control: () =>
          "rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500",
        menu: () => "z-50",
      }}
      onChange={onChange}
    />
  );
}
