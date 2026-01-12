"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    setMessage("Account deletion will be wired to the backend.");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Privacy</h1>
        <p className="text-gray-600 mt-4">
          Manage your account data and privacy preferences.
        </p>

        <div className="mt-10 border border-red-200 bg-red-50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-red-700">
            Delete account
          </h2>
          <p className="text-sm text-red-600 mt-2">
            Deleting your account removes your access and data from this device.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            className="mt-4 px-5 py-2.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-100"
          >
            Delete account
          </button>
        </div>

        {message && <p className="text-sm text-gray-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
