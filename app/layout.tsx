import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/app/context/AuthProvider";

export const metadata = {
  title: "GitHunts - Track Your Contributions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
