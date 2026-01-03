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
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

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
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Could not load categories. Try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [router]);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
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
      const res = await fetch(`${API_BASE}/providers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          company_name: companyName,
          phone,
          bio: bio || undefined,
          city: city || undefined,
          zip: zip || undefined,
          category_ids: selectedCategories,
        }),
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
      setCity("");
      setZip("");
      setSelectedCategories([]);
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
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="San Juan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="00901"
              />
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
