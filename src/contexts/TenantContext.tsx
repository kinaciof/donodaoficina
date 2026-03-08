"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface TenantData {
  tenant_id: string;
  company_name: string;
  cnpj?: string;
  isInformal?: boolean;
  status: string;
  // you can extend this interface as the app grows
}

interface TenantContextType {
  tenantId: string | null;
  tenantData: TenantData | null;
  loadingTenant: boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenantData: null,
  loadingTenant: true,
});

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTenant = async () => {
      if (!user) {
        if (isMounted) {
          setTenantId(null);
          setTenantData(null);
          setLoadingTenant(false);
        }
        return;
      }

      setLoadingTenant(true);
      try {
        // Obter o perfil do usuário para descobrir a qual tenant ele pertence
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const userTenantId = userData.tenant_id;
          
          if (userTenantId) {
            if (isMounted) setTenantId(userTenantId);

            // Carregar os dados base do tenant atual
            const tenantDocRef = doc(db, "tenants", userTenantId);
            const tenantSnap = await getDoc(tenantDocRef);

            if (tenantSnap.exists() && isMounted) {
              setTenantData(tenantSnap.data() as TenantData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
      } finally {
        if (isMounted) setLoadingTenant(false);
      }
    };

    if (!loading) {
      fetchTenant();
    }

    return () => {
      isMounted = false;
    };
  }, [user, loading]);

  return (
    <TenantContext.Provider value={{ tenantId, tenantData, loadingTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
