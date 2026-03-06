"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenantId: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Fetch user metadata from a central "users" collection to find their tenant and role
          // Assuming structure: users/{uid} -> { tenant_id: "...", role: "..." }
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setTenantId(data.tenant_id || null);
            setRole(data.role || null);
          } else {
            console.warn("User document not found in Firestore.");
            setTenantId(null);
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user tenant/role:", error);
        }
      } else {
        setUser(null);
        setTenantId(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, tenantId, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);