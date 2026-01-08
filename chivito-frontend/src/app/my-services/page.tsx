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
  user_id?: number | null;
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
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const buildPhotoUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function MyServicesPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = useMemo(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      const idValue = typeof parsed?.id === "number" ? parsed.id : Number(parsed?.id);
      return Number.isNaN(idValue) ? null : idValue;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }

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
        setProviders(mapped);
      } catch (err) {
        console.error(err);
        setError("Could not load your services.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUserId, router]);

  const myProviders = useMemo(() => {
    if (!currentUserId) return [];
    return providers.filter((p) => p.user_id === currentUserId);
  }, [providers, currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 gap-4">
        <p>{error}</p>
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Back to profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600">
              Manage the services you have posted.
            </p>
          </div>
          <button
            onClick={() => router.push("/register-your-service")}
            className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Post a service
          </button>
        </div>

        {myProviders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6 text-gray-600">
            You have not posted any services yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={provider.photo1 || "/cleaning-1.jpg"}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900">
                      {provider.name}
                      {provider.company_name ? ` • ${provider.company_name}` : ""}
                    </div>
                    <div className="text-sm text-gray-600">
                      {provider.city || "Service area"}
                    </div>
                    <div className="text-sm text-purple-600 font-semibold">
                      {provider.price != null && !Number.isNaN(provider.price)
                        ? `$${provider.price.toFixed(2)}`
                        : "Contact for quote"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {provider.categories.map((service) => (
                    <span
                      key={service.id}
                      className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push(`/providers/${provider.id}`)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/providers/${provider.id}/edit`)}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
