"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isExpired, trialEndsAt } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPublicRoute = ["/login", "/client-access"].includes(pathname || "");

  if (!user || isPublicRoute) {
    return <>{children}</>;
  }

  // Calculate remaining days for the banner
  let daysRemaining = null;
  if (trialEndsAt && !isExpired) {
    const now = new Date();
    const diffTime = trialEndsAt.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden flex flex-col h-screen">
        
        {/* Trial Banner */}
        {daysRemaining !== null && daysRemaining <= 15 && user.email !== "krystianoinacio@gmail.com" && (
          <div className="bg-orange-500 text-white px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 shadow-sm z-10 shrink-0">
            <AlertCircle size={18} />
            <span>
              Seu período de testes termina em <strong>{daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}</strong>.
            </span>
            <Link href="/billing" className="ml-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs transition-colors">
              Assinar agora
            </Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
