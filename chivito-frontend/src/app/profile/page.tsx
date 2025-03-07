"use client";

import { useState } from "react";
import ProfileScreen from "../components/profile";
import LoginScreen from "../auth/login/login";
import router from "next/router";

export default function ProfilePage() {
  // Simulating user authentication state
  const [user, setUser] = useState(null); // Change `null` to `mockUser` to test

  // TODO:if user is not logged in, show the login screen, if user is logged in, show the profile screen
  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <ProfileScreen />
      ) : (
        <>
          <LoginScreen onLogin={(userData) => setUser(userData)} />
          <button onClick={() => router.push("/profile")}>Go to Profile</button>
        </>
      )}
    </div>
  );
}
/* <ProfileScreen /> */
/* <LoginScreen onLogin={undefined} /> */
