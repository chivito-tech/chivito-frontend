"use client";

import { useEffect, useState } from "react";
import LoginScreen from "../auth/login/login";
import ProfileScreen from "../components/profile";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          // Combine name for your component's expected shape
          setUser({
            id: data.data.id,
            name: `${data.data.first_name} ${data.data.last_name}`,
            email: data.data.email,
            photo: data.data.photo,
          });
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (!hasMounted) return null;

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <ProfileScreen user={user} />
      ) : (
        <LoginScreen
          onLogin={(userData: User) => {
            setUser(userData);
          }}
        />
      )}
    </div>
  );
}
