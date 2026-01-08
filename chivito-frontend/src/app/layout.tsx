import Navbar from "@/app/components/Navbar";
import "../app/globals.css"; // Ensure this line is present
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";

export const metadata = {
  icons: {
    icon: "/logo.png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full bg-gray-50">
      <body className="min-h-screen w-full bg-gray-50">
        <Navbar />
        <main className="min-h-screen w-full bg-gray-50 pb-20">{children}</main>
        <Footer />
        {/* commented for now, prob remove later */}
        {/* <BottomNav /> */}
      </body>
    </html>
  );
}
