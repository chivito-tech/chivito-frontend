"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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

const areaOptions = [
  "North",
  "South",
  "East",
  "West",
  "Centro",
  "Metro",
  "Isla",
];

const splitServiceAreas = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(/[,/]+/)
    .map((part) => part.trim())
    .filter(Boolean);
};

const normalizeArea = (value: string) => value.trim().toLowerCase();

export default function EditProviderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [startingPrice, setStartingPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => localStorage.getItem("token"), []);
  const currentUserId = useMemo(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return typeof parsed?.id === "number" ? parsed.id : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setError("Please log in to edit your service.");
      router.push("/login");
      return;
    }

    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [providerRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/providers/${id}`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_BASE}/categories`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!providerRes.ok) throw new Error("Failed to load provider");
        if (!categoriesRes.ok) throw new Error("Failed to load categories");

        const providerData = (await providerRes.json()) as Provider;
        const categoryData = (await categoriesRes.json()) as Category[];

        if (currentUserId != null && providerData.user_id !== currentUserId) {
          setError("You do not have permission to edit this service.");
          return;
        }

        setCategories(categoryData);
        setName(providerData.name);
        setCompanyName(providerData.company_name);
        setPhone(providerData.phone);
        setBio(providerData.bio ?? "");
        setStartingPrice(
          providerData.price != null && !Number.isNaN(providerData.price)
            ? providerData.price.toString()
            : ""
        );
        setIsActive(providerData.status !== "inactive");
        const initialAreas = splitServiceAreas(providerData.city).map((area) => {
          const match = areaOptions.find(
            (option) => normalizeArea(option) === normalizeArea(area)
          );
          return match ?? area;
        });
        setAreas(initialAreas);
        setSelectedCategories(providerData.categories.map((c) => c.id));
        setExistingPhotos(
          [providerData.photo1, providerData.photo2, providerData.photo3]
            .map((photo) => buildPhotoUrl(photo))
            .filter(Boolean) as string[]
        );
      } catch (err) {
        console.error(err);
        setError("Could not load provider. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, router, token, currentUserId]);

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const toggleArea = (area: string) => {
    setAreas((prev) =>
      prev.includes(area) ? prev.filter((value) => value !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name || !companyName || !phone) {
      setError("Name, company name, and phone are required.");
      return;
    }

    if (!selectedCategories.length) {
      setError("Please pick at least one category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", name);
      formData.append("company_name", companyName);
      formData.append("phone", phone);
      formData.append("bio", bio);
      formData.append("status", isActive ? "approved" : "inactive");
      if (areas.length) formData.append("city", areas.join(", "));
      if (startingPrice && !Number.isNaN(parseFloat(startingPrice))) {
        formData.append(
          "price",
          Number(parseFloat(startingPrice).toFixed(2)).toString()
        );
      }
      selectedCategories.forEach((id) =>
        formData.append("category_ids[]", id.toString())
      );
      photos.slice(0, 3).forEach((file) => formData.append("photos[]", file));

      const res = await fetch(`${API_BASE}/providers/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data?.message ||
          data?.error ||
          (data?.errors && JSON.stringify(data.errors)) ||
          "Something went wrong.";
        setError(detail);
        return;
      }

      setMessage("Service updated.");
      setPhotos([]);
      router.push("/my-services");
    } catch (err) {
      console.error(err);
      setError("Could not update right now. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service? This cannot be undone."
    );
    if (!confirmDelete) return;
    if (!token) {
      router.push("/login");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/providers/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        const detail =
          data?.message ||
          data?.error ||
          (data?.errors && JSON.stringify(data.errors)) ||
          "Could not delete service.";
        setError(detail);
        return;
      }

      router.push("/my-services");
    } catch (err) {
      console.error(err);
      setError("Could not delete right now. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading service...
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 gap-4">
        <p>{error}</p>
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
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="mb-6">
          <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
            Edit your service
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Update your listing
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Company name
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Company name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Phone number"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Starting price
              </label>
              <input
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Starting price"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              About your service
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[120px]"
              placeholder="Share your experience and what you offer"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Service areas
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {areaOptions.map((area) => {
                const active = areas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      active
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Categories
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      active
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Listing status
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Inactive services are hidden from search and listings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive((prev) => !prev)}
                className={`w-12 h-6 rounded-full transition ${
                  isActive ? "bg-purple-600" : "bg-gray-300"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Photos
            </label>
            {existingPhotos.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-3">
                {existingPhotos.map((photo, index) => (
                  <div
                    key={`${photo}-${index}`}
                    className="h-24 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={photo}
                      alt={`Current photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full text-sm text-gray-700"
                onChange={(e) =>
                  setPhotos(e.target.files ? Array.from(e.target.files) : [])
                }
              />
              <p className="text-xs text-gray-500 mt-2">
                Uploading new photos will replace your current ones.
              </p>
            </div>
            {photoPreviews.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {photoPreviews.length} new photo(s) selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhotos([])}
                    className="text-xs text-purple-600 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {photoPreviews.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="h-24 rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={src}
                        alt={`Selected photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/providers/${id}`)}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
          </div>

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 border border-red-200 bg-red-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-red-700">Danger zone</h3>
          <p className="text-sm text-red-600 mt-2">
            Deleting a service removes it permanently. This action cannot be
            undone.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="mt-4 px-5 py-2.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-100 disabled:opacity-70"
          >
            {isDeleting ? "Deleting..." : "Delete service"}
          </button>
        </div>
      </div>
    </div>
  );
}
