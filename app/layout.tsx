
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/app/context/AuthProvider";
import ClientSessionProvider from "@/app/context/SessionProvider";

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
        <ClientSessionProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
