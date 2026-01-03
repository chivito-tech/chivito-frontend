"use client";
import { useEffect, useMemo, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Provider = {
  id: number;
  name: string;
  company_name: string;
  phone: string;
  bio?: string | null;
  city?: string | null;
  zip?: string | null;
  status: string;
  price?: number | null;
  categories: Category[];
  // UI-only fallbacks
  image?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

export default function Home() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [providersRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/providers`, { headers: { Accept: "application/json" } }),
          fetch(`${API_BASE}/categories`, { headers: { Accept: "application/json" } }),
        ]);

        if (!providersRes.ok) throw new Error("Failed to load providers");
        if (!categoriesRes.ok) throw new Error("Failed to load categories");

        const providersData = await providersRes.json();
        const categoriesData = await categoriesRes.json();

        const mapped = (providersData as Provider[]).map((p) => ({
          ...p,
          image: "/cleaning-1.jpg",
        }));

        setProviders(mapped);
        setCategories(categoriesData as Category[]);
      } catch (err) {
        console.error(err);
        setError("Could not load data right now.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryFilters = useMemo(() => {
    const names = new Set<string>();

    // Prefer API categories if available
    categories.forEach((c) => names.add(c.name || c.slug));

    // Fallback to provider categories if none loaded yet
    providers.forEach((p) =>
      p.categories.forEach((c) => names.add(c.name || c.slug)),
    );
    return Array.from(names).slice(0, 8);
  }, [providers, categories]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 md:px-12">
      <div className="flex justify-between items-center w-full max-w-5xl mt-8 mb-8 px-4 md:px-0">
        <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
        <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition">
          See All
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-5xl">
        {(categoryFilters.length ? categoryFilters : ["Plumber", "Electrician"])
          .slice(0, 8)
          .map((service, index) => (
            <button key={index} className="flex flex-col items-center group">
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/broom.png"
                  alt={service}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-black">{service}</p>
            </button>
          ))}
      </div>
      <div className="w-full h-px mt-8 bg-gray-200"></div>
      <div className="flex justify-between items-center w-full max-w-5xl mt-8 mb-3 px-4 md:px-0">
        <h3 className="text-xl font-semibold text-gray-900">
          Most Popular Services
        </h3>
        <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition">
          See All
        </p>
      </div>
      <div className="w-full">
        <div className="flex justify-center md:justify-center mb-6 overflow-x-auto">
          <div className="flex space-x-4 px-4 md:px-0 py-2 max-w-5xl">
            {(categoryFilters.length
              ? categoryFilters
              : ["Plumber", "Electrician", "Painter", "Detailer"]
            ).map((service, index) => (
              <button
                key={index}
                className="whitespace-nowrap rounded-full bg-white shadow-md px-6 py-2 text-sm font-medium text-gray-700 border-gray-300 transition hover:bg-gray-100 hover:shadow-lg"
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {providers.map((provider) => (
          <div
            key={provider.id}
            onClick={() => setSelectedProvider(provider)}
            className="cursor-pointer flex items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={provider.image || "/cleaning-1.jpg"}
                alt={provider.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="ml-4 flex-1">
              <h3 className="text-black font-semibold">
                {provider.name}
                {provider.company_name ? ` • ${provider.company_name}` : ""}
              </h3>
              <p className="text-black">
                <span className="text-purple-600 font-semibold">
                  {provider.price != null && !Number.isNaN(provider.price)
                    ? `$${provider.price.toFixed(2)}`
                    : "Contact for quote"}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {provider.categories.map((service) => (
                  <span
                    key={service.id}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-xs"
                  >
                    {service.name}
                  </span>
                ))}
              </div>
              <div className="w-full h-px mt-2 bg-gray-200"></div>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-1.5 py-0 rounded-full">
                  {provider.city || "Service area"}
                </span>
              </div>
            </div>

            <button className="ml-auto text-purple-600">📌</button>
          </div>
        ))}

        {!providers.length && !loading && (
          <div className="text-gray-600">No services yet. Be the first!</div>
        )}
        {loading && (
          <div className="text-gray-500">Loading services...</div>
        )}
        {error && !loading && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
      </div>

      {/* MODAL */}
      {selectedProvider && (
        <div className="fixed backdrop-blur-xs inset-0 bg-opacity-50 flex justify-center items-center p-4 z-50">
          {/* Prevent Background Scrolling */}
          <style>{`body { overflow: hidden; }`}</style>

          <div className="bg-white p-7 rounded-lg max-w-lg w-full shadow-lg relative flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => {
                setSelectedProvider(null);
                document.body.style.overflow = "auto"; // Restore scrolling
              }}
            >
              ✖
            </button>

            {/* Provider Image */}
            <div className="relative">
              <img
                src={selectedProvider.image || "/cleaning-1.jpg"}
                alt={selectedProvider.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              {/* Bookmark Button */}
              <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-purple-600 hover:text-purple-800">
                📌
              </button>
            </div>

            {/* Provider Info */}
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedProvider.name}
            </h2>
            <div className="flex items-center mt-2 text-gray-600 text-sm gap-2 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                {selectedProvider.city || "Service area"}
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                {selectedProvider.price != null && !Number.isNaN(selectedProvider.price)
                  ? `$${selectedProvider.price.toFixed(2)}`
                  : "Contact for quote"}
              </span>
            </div>

            {/* Service Category */}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProvider.categories.map((service) => (
                <span
                  key={service.id}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {service.name}
                </span>
              ))}
            </div>

            {/* Location */}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProvider.city ? (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedProvider.city}
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Service area
                </span>
              )}
            </div>

            {/* Pricing */}
            <p className="mt-4 text-xl font-semibold text-purple-700">
              {selectedProvider.price != null && !Number.isNaN(selectedProvider.price)
                ? `$${selectedProvider.price.toFixed(2)}`
                : "Contact for quote"}
            </p>

            {/* Phone Number (Clickable) */}
            <div className="mt-2 flex items-center">
              📞
              <a
                href={`tel:${selectedProvider.phone}`}
                className="ml-2 text-blue-600 font-medium hover:underline"
              >
                {selectedProvider.phone}
              </a>
            </div>

            {/* About Me Section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
              <p className="text-gray-600 mt-1">
                {selectedProvider.bio ?? "No description provided."}
              </p>
            </div>

            {/* Photos & Videos Placeholder */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Photos & Videos
              </h3>
              <div className="flex gap-3 mt-2">
                <div className="w-1/3 h-20 bg-gray-200 rounded-lg"></div>
                <div className="w-1/3 h-20 bg-gray-200 rounded-lg"></div>
                <div className="w-1/3 h-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              onClick={() => {
                setSelectedProvider(null);
                document.body.style.overflow = "auto"; // Restore scrolling
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
