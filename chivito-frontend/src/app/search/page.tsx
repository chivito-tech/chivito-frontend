"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Category = { id: number; name: string; slug: string };
type Subcategory = { id: number; name: string; slug: string; category_id: number };
type Provider = {
  id: number;
  name: string;
  company_name: string;
  phone: string;
  bio?: string | null;
  city?: string | null;
  status: string;
  price?: number | null;
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  categories: Category[];
  subcategories?: Subcategory[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const buildPhotoUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};

const splitServiceAreas = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(/[,/]+/)
    .map((part) => part.trim())
    .filter(Boolean);
};


const sortOptions = ["Price: Low to High", "Rating"];

export default function SearchPage() {
  const [sort, setSort] = useState("");
  const [results, setResults] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterIds, setFilterIds] = useState<number[]>([]);
  const [areaFilters, setAreaFilters] = useState<string[]>([]);
  const [subcategoryFilters, setSubcategoryFilters] = useState<Subcategory[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<number[]>(
    []
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const serviceAreaFilters = useMemo(
    () => [
      { value: "north", label: "North" },
      { value: "south", label: "South" },
      { value: "east", label: "East" },
      { value: "west", label: "West" },
      { value: "metro", label: "Metro" },
      { value: "centro", label: "Centro" },
      { value: "isla", label: "Isla" },
    ],
    []
  );

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

        const mapped = data.map((p) => ({
          ...p,
          photo1: buildPhotoUrl(p.photo1),
          photo2: buildPhotoUrl(p.photo2),
          photo3: buildPhotoUrl(p.photo3),
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

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ ids?: number[] }>).detail;
      setFilterIds(detail?.ids ?? []);
    };
    window.addEventListener("service-filter", handler as EventListener);
    return () =>
      window.removeEventListener("service-filter", handler as EventListener);
  }, []);

  useEffect(() => {
    const categoriesParam = searchParams.get("categories");
    if (!categoriesParam) return;
    const parsed = categoriesParam
      .split(",")
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value));
    if (parsed.length) {
      setFilterIds(parsed.slice(0, 2));
    }
  }, [searchParams]);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (!filterIds.length) {
        setSubcategoryFilters([]);
        setSelectedSubcategoryIds([]);
        return;
      }
      try {
        const params = new URLSearchParams();
        filterIds.forEach((id) => params.append("category_ids[]", id.toString()));
        const res = await fetch(`${API_BASE}/subcategories?${params.toString()}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load subcategories");
        const data = (await res.json()) as Subcategory[];
        setSubcategoryFilters(data);
        setSelectedSubcategoryIds((prev) =>
          prev.filter((id) => data.some((sub) => sub.id === id))
        );
      } catch (err) {
        console.error(err);
        setSubcategoryFilters([]);
      }
    };

    loadSubcategories();
  }, [filterIds]);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    switch (sort) {
      case "Price: Low to High":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "Rating":
        // rating not available from backend
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

  const visibleResults = useMemo(() => {
    return sortedResults.filter((p) => {
      const matchesService =
        !filterIds.length || p.categories.some((c) => filterIds.includes(c.id));
      const matchesArea =
        !areaFilters.length ||
        splitServiceAreas(p.city)
          .map((area) => area.toLowerCase())
          .some((area) => areaFilters.includes(area));
      const matchesSubcategory =
        !selectedSubcategoryIds.length ||
        (p.subcategories || []).some((sub) =>
          selectedSubcategoryIds.includes(sub.id)
        );
      return matchesService && matchesArea && matchesSubcategory;
    });
  }, [sortedResults, filterIds, areaFilters, selectedSubcategoryIds]);

  const pagedResults = useMemo(
    () => visibleResults.slice(0, page * pageSize),
    [visibleResults, page]
  );

  useEffect(() => {
    // Reset pagination when filters/sort change
    setPage(1);
  }, [filterIds, areaFilters, selectedSubcategoryIds, sort, results.length]);

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

      <div className="flex justify-between items-center w-full max-w-5xl mt-6 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Service area</h3>
      </div>
      <div className="flex flex-wrap gap-2 w-full max-w-5xl mb-6">
        {serviceAreaFilters.map((city) => {
            const active = areaFilters.includes(city.value);
            return (
              <button
                key={city.value}
                onClick={() => {
                  setAreaFilters((prev) =>
                    prev.includes(city.value)
                      ? prev.filter((item) => item !== city.value)
                      : [...prev, city.value]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  active
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                }`}
              >
                {city.label}
              </button>
            );
          })}
      </div>

      {subcategoryFilters.length > 0 && (
        <>
          <div className="flex justify-between items-center w-full max-w-5xl mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Sub-categories
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 w-full max-w-5xl mb-6">
            {subcategoryFilters.map((sub) => {
              const active = selectedSubcategoryIds.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  onClick={() =>
                    setSelectedSubcategoryIds((prev) =>
                      prev.includes(sub.id)
                        ? prev.filter((id) => id !== sub.id)
                        : [...prev, sub.id]
                    )
                  }
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    active
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </>
      )}

      {loading && <div className="text-gray-600">Loading...</div>}
      {error && !loading && <div className="text-red-600 text-sm">{error}</div>}
      {!loading &&
        !error &&
        visibleResults.length === 0 &&
        (filterIds.length > 0 ||
          areaFilters.length > 0 ||
          selectedSubcategoryIds.length > 0) && (
          <div className="text-gray-600 text-sm">
            No services found for this search.
          </div>
        )}

      <AnimatePresence>
        {pagedResults.map((provider) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
            className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer"
            onClick={() => router.push(`/providers/${provider.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={provider.photo1 || "/cleaning-1.jpg"}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="text-black font-semibold">
                  {provider.name}
                  {provider.company_name ? ` • ${provider.company_name}` : ""}
                </div>
                <div className="text-sm text-gray-700">
                  Starting at:{" "}
                  <span className="text-purple-600 font-bold">
                    {provider.price != null && !Number.isNaN(provider.price)
                      ? `$${provider.price.toFixed(2)}`
                      : "Contact for quote"}
                  </span>
                </div>
              </div>
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
              {(provider.subcategories || []).map((sub) => (
                <span
                  key={sub.id}
                  className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"
                >
                  {sub.name}
                </span>
              ))}
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {provider.city || "Service area"}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {pagedResults.length < visibleResults.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
