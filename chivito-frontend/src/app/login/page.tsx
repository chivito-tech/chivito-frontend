"use client";

import { useRouter } from "next/navigation";
import Login from "@/app/auth/login/login";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Login
      onLogin={(userData) => {
        // Persist basic session info
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData?.token) {
          localStorage.setItem("token", userData.token);
        }
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
      }}
    />
  );
}
