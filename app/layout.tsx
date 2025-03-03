
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/app/context/AuthProvider";
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
