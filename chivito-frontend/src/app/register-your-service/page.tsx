"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

export default function RegisterYourService() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [startingPrice, setStartingPrice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const areaOptions = [
    "North",
    "South",
    "East",
    "West",
    "Centro",
    "Metro",
    "Isla",
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthed(true);
    } else {
      setError("Please log in or create an account to add a service.");
      router.push("/signup");
      return;
    }

    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await res.json();
        const sorted = [...data].sort((a, b) =>
          (a.name || a.slug).localeCompare(b.name || b.slug)
        );
        setCategories(sorted);
      } catch (err) {
        console.error(err);
        setError("Could not load categories. Try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [router]);

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
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("company_name", companyName);
      formData.append("phone", phone);
      if (bio) formData.append("bio", bio);
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

      const res = await fetch(`${API_BASE}/providers`, {
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

      setMessage("Service submitted! Status: pending.");
      setName("");
      setCompanyName("");
      setPhone("");
      setBio("");
      setAreas([]);
      setStartingPrice("");
      setSelectedCategories([]);
      setPhotos([]);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Could not submit right now. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <div className="mb-6">
          <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
            Register your service
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Start getting booked
          </h1>
          <p className="text-gray-600 mt-2">
            Tell us about your service and pick the categories that match what
            you offer.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Doe Repairs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {areaOptions.map((area) => {
                  const active = areas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() =>
                        setAreas((prev) => {
                          if (area === "Isla") {
                            return prev.includes("Isla") ? [] : ["Isla"];
                          }

                          const cleaned = prev.filter((a) => a !== "Isla");

                          let updated = cleaned.includes(area)
                            ? cleaned.filter((a) => a !== area)
                            : [...cleaned, area];

                          const nonIslaOptions = areaOptions.filter(
                            (opt) => opt !== "Isla"
                          );
                          if (
                            updated.length === nonIslaOptions.length &&
                            nonIslaOptions.every((opt) => updated.includes(opt))
                          ) {
                            updated = ["Isla"];
                          }

                          return updated;
                        })
                      }
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        active
                          ? "bg-purple-600 text-white border-purple-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting price
              </label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  onBlur={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!Number.isNaN(val)) {
                      setStartingPrice(val.toFixed(2));
                    }
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="25.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell customers what you do best."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Photos (up to 3, optional)
              </label>
              <div className="mt-2 rounded-lg border border-dashed border-gray-300 p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 3);
                    setPhotos(files);
                  }}
                  className="w-full text-sm text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Add up to 3 photos to help customers recognize your service.
                </p>
              </div>
              {photoPreviews.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {photoPreviews.length} photo(s) selected
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
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Categories *
              </label>
              {loadingCategories && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow"
                        : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
              {!categories.length && !loadingCategories && (
                <p className="text-sm text-gray-500">
                  No categories found. Try again later.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-purple-600 text-white font-semibold py-3 shadow-md transition hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit your service"}
          </button>
        </form>
      </div>
    </div>
  );
}
