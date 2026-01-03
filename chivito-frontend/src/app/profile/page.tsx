"use client";

import ProfileScreen from "@/app/components/profile";

const mockUser = {
  id: "1",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  photo: "/user-avatar.jpg",
};

export default function ProfilePage() {
  return <ProfileScreen user={mockUser} />;
}
