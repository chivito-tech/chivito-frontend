"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Subcategory = {
  id: number;
  name: string;
  slug: string;
  category_id: number;
};

type Review = {
  id: number;
  rating: number;
  description?: string | null;
  user?: { id: number; first_name?: string | null; last_name?: string | null };
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
  subcategories?: Subcategory[];
  reviews?: Review[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

const buildPhotoUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
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
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

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

  const averageRating = useMemo(() => {
    if (!provider?.reviews?.length) return null;
    const total = provider.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / provider.reviews.length;
  }, [provider?.reviews]);

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
              {(provider.subcategories || []).map((sub) => (
                <span
                  key={sub.id}
                  className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {sub.name}
                </span>
              ))}
            </div>

            {averageRating != null && (
              <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(averageRating)) +
                    "☆".repeat(5 - Math.round(averageRating))}
                </span>
                <span>
                  {averageRating.toFixed(1)} ({provider.reviews?.length ?? 0})
                </span>
              </div>
            )}

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

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
              <div className="mt-4 space-y-4">
                {(provider.reviews || []).length === 0 && (
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                )}
                {(provider.reviews || []).map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {[review.user?.first_name, review.user?.last_name]
                          .filter(Boolean)
                          .join(" ") || "User"}
                      </span>
                      <span className="text-yellow-500">
                        {"★".repeat(review.rating) +
                          "☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {review.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900">
                  Leave a review
                </h4>
                <div className="mt-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewRating(value)}
                      className={`text-xl ${
                        value <= reviewRating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3"
                  rows={3}
                  placeholder="Optional description"
                />
                <button
                  type="button"
                  disabled={reviewLoading || reviewRating === 0}
                  onClick={async () => {
                    const storedUser = localStorage.getItem("user");
                    const token = localStorage.getItem("token");
                    if (!storedUser || !token) {
                      router.push("/login");
                      return;
                    }
                    if (!provider?.id) return;
                    setReviewLoading(true);
                    setReviewMessage(null);
                    try {
                      const res = await fetch(
                        `${API_BASE}/providers/${provider.id}/reviews`,
                        {
                          method: "POST",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            rating: reviewRating,
                            description: reviewText.trim() || null,
                          }),
                        }
                      );
                      const data = await res.json();
                      if (!res.ok) {
                        const detail =
                          data?.message ||
                          data?.error ||
                          (data?.errors && JSON.stringify(data.errors)) ||
                          "Could not submit review.";
                        setReviewMessage(detail);
                        return;
                      }
                      setProvider((prev) => {
                        if (!prev) return prev;
                        const remaining =
                          prev.reviews?.filter(
                            (r) => r.user?.id !== data.user?.id
                          ) ?? [];
                        return {
                          ...prev,
                          reviews: [data, ...remaining],
                        };
                      });
                      setReviewMessage("Review submitted.");
                      setReviewText("");
                      setReviewRating(0);
                    } catch (err) {
                      console.error(err);
                      setReviewMessage("Could not submit review.");
                    } finally {
                      setReviewLoading(false);
                    }
                  }}
                  className="mt-3 px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-70"
                >
                  {reviewLoading ? "Submitting..." : "Submit review"}
                </button>
                {reviewMessage && (
                  <p className="text-sm text-gray-600 mt-2">{reviewMessage}</p>
                )}
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
