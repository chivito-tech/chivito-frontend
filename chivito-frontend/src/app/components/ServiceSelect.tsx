"use client";

import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { motion } from "framer-motion";

type CategoryOption = { value: number; label: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

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
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        const mapped: CategoryOption[] = (data || []).map((c: any) => ({
          value: c.id,
          label: c.name ?? c.slug,
        }));
        setOptions(mapped);
      } catch (err) {
        console.error(err);
        setError("Could not load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (!mounted) return null;

  return (
    <Select
      options={options}
      isMulti
      placeholder={
        loading ? "Loading categories..." : error || "Search services..."
      }
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
