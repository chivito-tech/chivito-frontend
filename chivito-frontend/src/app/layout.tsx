import Navbar from "@/app/components/Navbar";
import "../app/globals.css"; // Ensure this line is present
import BottomNav from "./components/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full bg-gray-50">
      <body className="min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="min-h-screen w-full bg-gray-50">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
