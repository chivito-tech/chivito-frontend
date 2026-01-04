"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Category = { id: number; name: string; slug: string };
type Provider = {
  id: number;
  name: string;
  company_name: string;
  phone: string;
  bio?: string | null;
  city?: string | null;
  status: string;
  categories: Category[];
};

type Result = Provider & {
  price: number;
  rating: number;
  reviews: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

const sortOptions = ["Price: Low to High", "Rating", "Area", "Service"];

export default function SearchPage() {
  const [sort, setSort] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryFilters = useMemo(() => {
    const names = new Set<string>();
    results.forEach((p) =>
      p.categories.forEach((c) => names.add(c.name || c.slug)),
    );
    return Array.from(names).slice(0, 8);
  }, [results]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/providers`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load providers");
        const data = (await res.json()) as Provider[];

        const mapped: Result[] = data.map((p, index) => ({
          ...p,
          price: 25 + index, // simple fallback pricing
          rating: 4.8 - index * 0.05,
          reviews: (index + 1) * 120,
        }));

        setResults(mapped);
      } catch (err) {
        console.error(err);
        setError("Could not load providers right now.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    switch (sort) {
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "Rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Area":
        sorted.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
        break;
      case "Service":
        sorted.sort((a, b) => {
          const aService = a.categories[0]?.name || "";
          const bService = b.categories[0]?.name || "";
          return aService.localeCompare(bService);
        });
        break;
    }
    return sorted;
  }, [results, sort]);

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-800">
          Search Services
        </h2>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-1 border text-gray-700 rounded-md focus:ring-purple-500"
        >
          <option value="">Sort by</option>
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center w-full max-w-5xl mt-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-5xl mb-6">
        {(categoryFilters.length ? categoryFilters : ["Plumber", "Electrician"])
          .slice(0, 8)
          .map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center group bg-white rounded-xl shadow-sm p-3"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-full shadow-md transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/broom.png"
                  alt={service}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-black text-center">
                {service}
              </p>
            </div>
          ))}
      </div>

      {loading && <div className="text-gray-600">Loading...</div>}
      {error && !loading && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <AnimatePresence>
        {sortedResults.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <div className="text-black font-semibold">
              {provider.name}
              {provider.company_name ? ` • ${provider.company_name}` : ""}
            </div>
            <div className="text-sm text-gray-700">
              Starting at:{" "}
              <span className="text-purple-600 font-bold">
                ${provider.price}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {provider.categories.map((service) => (
                <span
                  key={service.id}
                  className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {service.name}
                </span>
              ))}
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {provider.city || "Service area"}
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                ⭐ {provider.rating.toFixed(1)} |{" "}
                {provider.reviews.toLocaleString()} reviews
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {provider.status}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
