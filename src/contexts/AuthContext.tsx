"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  role: string | null;
  loading: boolean;
  impersonateTenant: (id: string | null) => void;
  trialEndsAt: Date | null;
  isExpired: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenantId: null,
  role: null,
  loading: true,
  impersonateTenant: () => {},
  trialEndsAt: null,
  isExpired: false,
});

const PUBLIC_ROUTES = ["/login", "/client-access"];
const ALLOWED_EXPIRED_ROUTES = ["/billing", "/login", "/admin"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [impersonatedTenantId, setImpersonatedTenantId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let fetchedTenantId = firebaseUser.uid; // Fallback
          let fetchedTrialEnds = new Date(); // Fallback today
          fetchedTrialEnds.setDate(fetchedTrialEnds.getDate() + 15); // +15 days by default if new
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            fetchedTenantId = data.tenant_id || firebaseUser.uid;
            setTenantId(fetchedTenantId);
            setRole(data.role || "owner");
            
            // Handle Trial logic
            if (data.trialEndsAt) {
              fetchedTrialEnds = data.trialEndsAt.toDate();
            }
            setTrialEndsAt(fetchedTrialEnds);
          } else {
            console.warn("User document not found. Using defaults.");
            setTenantId(fetchedTenantId);
            setRole("owner");
            setTrialEndsAt(fetchedTrialEnds);
          }

          // Check expiration
          const now = new Date();
          const expired = now > fetchedTrialEnds;
          
          // Super Admin bypasses expiration logic
          const isSuperAdmin = firebaseUser.email === "krystianoinacio@gmail.com";
          
          if (expired && !isSuperAdmin) {
            setIsExpired(true);
            if (!ALLOWED_EXPIRED_ROUTES.includes(pathname || "")) {
              router.push("/billing");
            }
          } else {
            setIsExpired(false);
            if (pathname === "/login") {
              router.push("/");
            }
          }

        } catch (error) {
          console.error("Error fetching user data:", error);
          setTenantId(firebaseUser.uid);
        }
      } else {
        // Logged out state
        setUser(null);
        setTenantId(null);
        setRole(null);
        setImpersonatedTenantId(null);
        setTrialEndsAt(null);
        setIsExpired(false);

        if (!PUBLIC_ROUTES.includes(pathname || "")) {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const activeTenantId = impersonatedTenantId || tenantId;

  return (
    <AuthContext.Provider value={{ 
      user, 
      tenantId: activeTenantId, 
      role, 
      loading,
      impersonateTenant: setImpersonatedTenantId,
      trialEndsAt,
      isExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
