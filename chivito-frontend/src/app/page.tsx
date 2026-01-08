"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  photo1?: string | null;
  photo2?: string | null;
  photo3?: string | null;
  categories: Category[];
  // UI-only fallbacks
  image?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const buildPhotoUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};


export default function Home() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterIds, setFilterIds] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [providersRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/providers`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_BASE}/categories`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!providersRes.ok) throw new Error("Failed to load providers");
        if (!categoriesRes.ok) throw new Error("Failed to load categories");

        const providersData = await providersRes.json();
        const categoriesData = await categoriesRes.json();

        const mapped = (providersData as Provider[]).map((p) => {
          const photo1 = buildPhotoUrl(p.photo1);
          const photo2 = buildPhotoUrl(p.photo2);
          const photo3 = buildPhotoUrl(p.photo3);

          return {
            ...p,
            photo1,
            photo2,
            photo3,
            image: photo1 || "/cleaning-1.jpg",
          };
        });

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

  const categoryList = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((c) => map.set(c.id, c.name || c.slug));
    providers.forEach((p) =>
      p.categories.forEach((c) => {
        if (!map.has(c.id)) {
          map.set(c.id, c.name || c.slug);
        }
      })
    );
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [providers, categories]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ ids?: number[] }>).detail;
      setFilterIds(detail?.ids ?? []);
    };

    window.addEventListener("service-filter", handler as EventListener);
    return () =>
      window.removeEventListener("service-filter", handler as EventListener);
  }, []);

  const visibleProviders = useMemo(() => {
    if (!filterIds.length) return providers;
    return providers.filter((p) =>
      p.categories.some((c) => filterIds.includes(c.id))
    );
  }, [providers, filterIds]);

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 md:px-12">
      <div className="flex justify-between items-center w-full max-w-5xl mt-8 mb-3 px-4 md:px-0">
        <h3 className="text-xl font-semibold text-gray-900">
          Most Popular Services
        </h3>
      </div>
      <div className="w-full max-w-5xl mb-6">
        <div className="flex items-center justify-between px-1">
          {/* <h4 className="text-sm font-semibold text-gray-700">Categories</h4> */}
          {categoryList.length > 8 && (
            <span className="text-xs text-gray-500">Scroll to see more</span>
          )}
        </div>
        <div className="flex space-x-3 overflow-x-auto px-1 py-3">
          {categoryList
            .slice(0, Math.max(categoryList.length, 8))
            .map((cat) => {
              const active = filterIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFilterIds((prev) => {
                      const next = prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id];
                      window.dispatchEvent(
                        new CustomEvent("service-filter", {
                          detail: { ids: next },
                        })
                      );
                      return next;
                    });
                  }}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium border transition hover:bg-gray-100 hover:shadow-lg ${
                    active
                      ? "bg-purple-600 text-white border-purple-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {visibleProviders.map((provider) => (
          <div
            key={provider.id}
            onClick={() => router.push(`/providers/${provider.id}`)}
            className="cursor-pointer flex items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={provider.photo1 || provider.image || "/cleaning-1.jpg"}
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

            {/* <button
              className="ml-auto text-purple-600"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/providers/${provider.id}`);
              }}
            >
              📌
            </button> */}
          </div>
        ))}

        {!providers.length && !loading && (
          <div className="text-gray-600">No services yet. Be the first!</div>
        )}
        {loading && <div className="text-gray-500">Loading services...</div>}
        {error && !loading && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}
