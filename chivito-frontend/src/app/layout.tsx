import "../app/globals.css"; // Ensure this line is present
import Navbar from "@/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {/* TESTING */}
        {/* <div> */}
        <Navbar />
        <main className="">{children}</main>
        {/* </div> */}
      </body>
    </html>
  );
}
