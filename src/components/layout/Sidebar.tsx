"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  FileText, 
  Settings, 
  ShieldCheck,
  LogOut,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/os", label: "Ordens de Serviço", icon: Wrench },
  { href: "/fiscal", label: "Módulo Fiscal", icon: FileText },
  { href: "/billing", label: "Assinatura", icon: CreditCard },
  { href: "/3a502f6b86d9a18016f4d38c64e5264f", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { tenantData } = useTenant();
  const isSuperAdmin = user?.email === "krystianoinacio@gmail.com";

  const handleLogout = () => {
    auth.signOut();
  };

  const navContent = (
    <>
      <div className="p-4 flex items-center gap-3 border-b border-white/10 mb-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-700 font-bold text-xl shadow-inner shrink-0">
          DO
        </div>
        <div className="flex-1 truncate">
          <h1 className="text-xl font-bold tracking-wide text-white" title={tenantData?.company_name || "Dono da Oficina"}>
            {tenantData?.company_name || "Dono da Oficina"}
          </h1>
          <p className="text-xs text-emerald-200 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? "bg-emerald-600/50 text-white font-medium shadow-sm" 
                  : "text-emerald-100/70 hover:bg-emerald-700/50 hover:text-white"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-emerald-300"} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {isSuperAdmin && (
          <div className="mt-8">
            <div className="px-3 mb-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Administração Global
            </div>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === "/admin" 
                  ? "bg-red-900/40 text-red-100 font-medium border border-red-500/30" 
                  : "text-red-200/70 hover:bg-red-900/30 hover:text-red-100"
              }`}
            >
              <ShieldCheck size={20} className="text-red-400" />
              <span>Minha Visão</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-100/70 hover:bg-emerald-700/50 hover:text-white transition-colors"
        >
          <LogOut size={20} className="text-emerald-300" />
          <span>Sair</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden bg-emerald-800 text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-emerald-700 font-bold shadow-inner shrink-0">
            DO
          </div>
          <span className="font-bold truncate max-w-[200px]">{tenantData?.company_name || "Dono da Oficina"}</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-emerald-700 rounded-md">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-emerald-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
