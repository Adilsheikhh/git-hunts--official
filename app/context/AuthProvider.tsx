
"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

type AuthContextType = {
  user: FirebaseUser | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase auth error:", error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: session || null, 
      loading: loading || status === "loading" 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
