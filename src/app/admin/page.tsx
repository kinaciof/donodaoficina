"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldAlert, Search, ShieldCheck, UserCheck, CalendarPlus, X } from "lucide-react";

const mockTenants = [
  { id: "tenant_abc123", name: "Oficina do João", email: "joao@oficina.com.br", plan: "Pro", status: "Ativo", trialEnds: "2026-04-10" },
  { id: "tenant_xyz789", name: "Auto Center Express", email: "contato@autocenterexpress.com", plan: "Trial", status: "Ativo", trialEnds: "2026-03-15" },
  { id: "tenant_qwe456", name: "Mecânica Master", email: "master@mecanica.com", plan: "Basic", status: "Bloqueado", trialEnds: "2026-02-28" },
];

export default function AdminPage() {
  const { user, impersonateTenant } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [extraDays, setExtraDays] = useState("15");

  if (!user || user.email !== "krystianoinacio@gmail.com") {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Acesso Negado</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          Esta área é restrita ao Super Administrador Global do sistema. O seu usuário não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  const filteredTenants = mockTenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImpersonate = (tenantId: string) => {
    impersonateTenant(tenantId);
    alert(`Modo Suporte ativado para o tenant: ${tenantId}`);
    router.push("/");
  };

  const handleAddDays = () => {
    alert(`Adicionados ${extraDays} dias para a oficina ${selectedTenant.name}!`);
    setSelectedTenant(null);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Minha Visão Global</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Painel de controle do Super Admin. Gerencie todos os Tenants.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail da oficina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
            />
          </div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Total de Oficinas: <span className="text-emerald-600 font-bold">{mockTenants.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Oficina</th>
                <th className="p-4 font-semibold">Plano</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Vencimento</th>
                <th className="p-4 font-semibold text-right">Ações (Super Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 dark:text-white">{tenant.name}</p>
                    <p className="text-xs text-slate-500">{tenant.email}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {tenant.id}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{tenant.plan}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      tenant.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                    {tenant.trialEnds}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedTenant(tenant)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Adicionar Dias de Assinatura"
                      >
                        <CalendarPlus size={18} />
                      </button>
                      <button 
                        onClick={() => handleImpersonate(tenant.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                        title="Acessar como esta oficina (Suporte)"
                      >
                        <UserCheck size={18} />
                        <span className="text-xs font-bold">Impersonate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Dias */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <CalendarPlus size={20} className="text-orange-500" />
                Estender Assinatura
              </h3>
              <button onClick={() => setSelectedTenant(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Quantos dias de cortesia você deseja adicionar para a oficina <strong className="text-slate-800 dark:text-white">{selectedTenant.name}</strong>?
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <input 
                  type="number" 
                  value={extraDays}
                  onChange={(e) => setExtraDays(e.target.value)}
                  className="w-24 text-center text-xl font-bold py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  min="1"
                />
                <span className="text-slate-600 font-medium">dias extras</span>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedTenant(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddDays}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors shadow-sm"
                >
                  Confirmar Adição
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
