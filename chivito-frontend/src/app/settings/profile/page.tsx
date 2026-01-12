"use client";

import { useEffect, useState } from "react";

type StoredUser = {
  id?: string | number;
  name?: string;
  email?: string;
};

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as StoredUser;
      if (parsed.name) setName(parsed.name);
      if (parsed.email) setEmail(parsed.email);
    } catch {
      // Ignore invalid stored user payloads.
    }
  }, []);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const stored = localStorage.getItem("user");
    const next = stored ? (JSON.parse(stored) as StoredUser) : {};
    const updated = { ...next, name, email };
    localStorage.setItem("user", JSON.stringify(updated));
    localStorage.setItem("profile-phone", phone);
    window.dispatchEvent(new Event("auth-change"));
    setMessage("Profile updated locally.");
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
