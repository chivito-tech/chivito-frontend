"use client";

import { useEffect, useState } from "react";

type StoredUser = {
  id?: string | number;
  name?: string;
  email?: string;
  photo?: string | null;
  first_name?: string;
  last_name?: string;
  phone_number?: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as StoredUser;
      if (parsed.name) {
        setName(parsed.name);
      } else if (parsed.first_name || parsed.last_name) {
        setName([parsed.first_name, parsed.last_name].filter(Boolean).join(" "));
      }
      if (parsed.email) setEmail(parsed.email);
    } catch {
      // Ignore invalid stored user payloads.
    }
    const storedPhone = localStorage.getItem("profile-phone");
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to update your profile.");
      return;
    }

    const [first_name, ...rest] = name.trim().split(" ");
    const last_name = rest.join(" ").trim();
    const formData = new FormData();
    if (first_name) formData.append("first_name", first_name);
    if (last_name) formData.append("last_name", last_name);
    if (email.trim()) formData.append("email", email.trim());
    if (phone.trim()) formData.append("phone_number", phone.trim());
    if (photoFile) formData.append("photo", photoFile);

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        const detail =
          data?.message ||
          data?.error ||
          (data?.errors && JSON.stringify(data.errors)) ||
          "Could not update profile.";
        setMessage(detail);
        return;
      }

      const updatedName = [data.first_name, data.last_name]
        .filter(Boolean)
        .join(" ");
      const updatedUser = {
        ...(JSON.parse(localStorage.getItem("user") || "{}") as StoredUser),
        name: updatedName || name,
        email: data.email ?? email,
        photo: data.photo ?? null,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number ?? null,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("profile-phone", phone);
      if (data.photo) {
        localStorage.setItem("profile-photo", data.photo);
      }
      window.dispatchEvent(new Event("auth-change"));
      setPhotoFile(null);
      setMessage("Profile updated.");
    } catch (err) {
      console.error(err);
      setMessage("Could not update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Profile Info</h1>
        <p className="text-gray-600 mt-4">
          Update your name, email, phone number, and profile photo.
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Profile photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Save
          </button>
          {message && (
            <div className="text-sm text-green-600">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
