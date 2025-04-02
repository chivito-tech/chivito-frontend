"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dummyData = [
  {
    name: "Joel Colon",
    price: 20,
    rating: 4.9,
    reviews: 6182,
    services: ["Painter", "Detailer", "Electrician"],
    area: "Isla",
  },
  {
    name: "Santos Daniel",
    price: 25,
    rating: 4.8,
    reviews: 8289,
    services: ["Construction", "Plumbing", "Electrician"],
    area: "Norte",
  },
];

const sortOptions = ["Price: Low to High", "Rating", "Area", "Service"];

export default function SearchPage() {
  const [sort, setSort] = useState("");
  const [results, setResults] = useState(dummyData);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSort(value);

    let sorted = [...results];
    switch (value) {
      case "Price: Low to High":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "Rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Area":
        sorted.sort((a, b) => a.area.localeCompare(b.area));
        break;
      case "Service":
        sorted.sort((a, b) =>
          a.services[0]?.localeCompare(b.services[0] || "")
        );
        break;
    }

    setResults(sorted);
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-purple-800">
          Search Services
        </h2>

        <select
          value={sort}
          onChange={handleSortChange}
          className="px-3 py-1 border text-gray-700 rounded-md focus:ring-purple-500"
        >
          <option value="">Sort by</option>
          {sortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {results.map((provider, idx) => (
          <motion.div
            key={provider.name + idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <div className="text-black font-semibold">{provider.name}</div>
            <div className="text-sm text-gray-700">
              Starting at:{" "}
              <span className="text-purple-600 font-bold">
                ${provider.price}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              {provider.services.map((service) => (
                <span
                  key={service}
                  className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {service}
                </span>
              ))}
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {provider.area}
              </span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                ⭐ {provider.rating} | {provider.reviews.toLocaleString()}{" "}
                reviews
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
