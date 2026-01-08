"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  tags?: string | null;
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

const splitTags = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
};

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed?.id === "number") {
          setCurrentUserId(parsed.id);
        }
      } catch (err) {
        console.error("Failed to parse user from storage", err);
      }
    }
  }, []);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!provider?.id) return;
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/bookmarks`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data = (await res.json()) as Provider[];
        setIsBookmarked(data.some((item) => item.id === provider.id));
      } catch (err) {
        console.error(err);
      }
    };

    loadBookmarks();
  }, [provider?.id]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/providers/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load provider");
        const data = (await res.json()) as Provider;
        setProvider({
          ...data,
          photo1: buildPhotoUrl(data.photo1),
          photo2: buildPhotoUrl(data.photo2),
          photo3: buildPhotoUrl(data.photo3),
        });
      } catch (err) {
        console.error(err);
        setError("Could not load provider");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const photos = useMemo(
    () =>
      [provider?.photo1, provider?.photo2, provider?.photo3].filter(Boolean) as
        | string[]
        | undefined,
    [provider]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading provider...
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 gap-4">
        <p>{error || "Provider not found."}</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <img
              src={provider.photo1 || "/cleaning-1.jpg"}
              alt={provider.name}
              className="w-full h-64 object-cover rounded-xl cursor-pointer"
              onClick={() =>
                setActivePhoto(provider.photo1 || "/cleaning-1.jpg")
              }
            />
            {photos && photos.length > 1 && (
              <div className="flex gap-3 mt-3">
                {photos.slice(0, 3).map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-1/3 h-20 object-cover rounded-lg cursor-pointer"
                    onClick={() => setActivePhoto(photo)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {provider.name}
                {provider.company_name ? ` • ${provider.company_name}` : ""}
              </h1>
              <div className="flex items-center gap-2">
                {provider.user_id != null &&
                  currentUserId === provider.user_id && (
                    <button
                      onClick={() =>
                        router.push(`/providers/${provider.id}/edit`)
                      }
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Edit service
                    </button>
                  )}
                <button
                  onClick={() => {
                    const storedUser = localStorage.getItem("user");
                    if (!storedUser) {
                      router.push("/login");
                      return;
                    }
                    const token = localStorage.getItem("token");
                    if (!token) {
                      router.push("/login");
                      return;
                    }
                    setBookmarkLoading(true);
                    const action = isBookmarked ? "DELETE" : "POST";
                    fetch(`${API_BASE}/bookmarks/${provider.id}`, {
                      method: action,
                      headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    })
                      .then((res) => {
                        if (!res.ok) {
                          throw new Error("Bookmark request failed");
                        }
                        setIsBookmarked(!isBookmarked);
                      })
                      .catch((err) => {
                        console.error(err);
                      })
                      .finally(() => setBookmarkLoading(false));
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    isBookmarked
                      ? "border-purple-600 text-purple-700 bg-purple-50"
                      : "border-gray-300 text-gray-700"
                  }`}
                  disabled={bookmarkLoading}
                >
                  {bookmarkLoading
                    ? "Saving..."
                    : isBookmarked
                      ? "Saved"
                      : "Save"}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                {provider.city || "Service area"}
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                {provider.price != null && !Number.isNaN(provider.price)
                  ? `$${provider.price.toFixed(2)}`
                  : "Contact for quote"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {provider.categories.map((c) => (
                <span
                  key={c.id}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {c.name}
                </span>
              ))}
              {splitTags(provider.tags).map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
              <p className="text-gray-700 mt-2">
                {provider.bio ?? "No description provided."}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <div className="mt-2 flex items-center gap-3 text-gray-700">
                📞{" "}
                <a
                  href={`tel:${provider.phone}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {provider.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activePhoto && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={activePhoto}
            alt="Expanded service photo"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
