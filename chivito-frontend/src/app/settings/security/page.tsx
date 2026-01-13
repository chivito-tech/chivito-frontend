"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to change your password.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/password/change`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail =
          data?.message ||
          data?.error ||
          (data?.errors && JSON.stringify(data.errors)) ||
          "Could not change password.";
        setMessage(detail);
        return;
      }
      setMessage("Password updated.");
    } catch (err) {
      console.error(err);
      setMessage("Could not change password.");
    }
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleLogoutAll = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${API_BASE}/logout/all`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Security</h1>
        <p className="text-gray-600 mt-4">
          Change your password and manage active sessions.
        </p>

        <form onSubmit={handleChangePassword} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Change password
          </button>
          {message && (
            <div className="text-sm text-gray-600">{message}</div>
          )}
        </form>

        <div className="mt-10 border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Log out of all sessions
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            This will sign you out on this device. Server-side session revocation
            can be added later.
          </p>
          <button
            type="button"
            onClick={handleLogoutAll}
            className="mt-4 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Log out everywhere
          </button>
        </div>
      </div>
    </div>
  );
}
