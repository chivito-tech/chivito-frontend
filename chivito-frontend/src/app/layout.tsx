import "../app/globals.css"; // Ensure this line is present
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/Navbar";

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
