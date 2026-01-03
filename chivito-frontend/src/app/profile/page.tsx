"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileScreen from "@/app/components/profile";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  photo?: string;
  token?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
    const handleAuthChange = () => loadUser();
    window.addEventListener("auth-change", handleAuthChange as EventListener);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfileScreen user={user} />;
}
