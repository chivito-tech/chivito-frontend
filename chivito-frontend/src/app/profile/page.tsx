"use client";

import { useState } from "react";
import LoginScreen from "../auth/login/login";
import ProfileScreen from "../components/profile";

interface User {
  id: string;
  name: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

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
