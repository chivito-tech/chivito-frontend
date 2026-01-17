"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

export default function MagicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const link = searchParams.get("link");
    if (link) {
      window.location.href = link;
      return;
    }
    if (!token) {
      setError("Missing magic link token.");
      return;
    }

    localStorage.setItem("token", token);
    fetch(`${API_BASE}/profile`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const name = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            name: name || data.email,
            email: data.email,
            photo: data.photo ?? null,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number ?? null,
          })
        );
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
      })
      .catch(() => {
        setError("Could not validate magic link.");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      {error ? error : "Signing you in..."}
    </div>
  );
}
