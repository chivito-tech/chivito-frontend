import TopBar from "@/app/components/Navbar";
import "../app/globals.css"; // Ensure this line is present
import BottomNav from "./components/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TopBar />
        <main className="">{children}</main>

        <BottomNav />
      </body>
    </html>
  );
}
