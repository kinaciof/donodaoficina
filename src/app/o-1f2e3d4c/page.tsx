"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Search, Wrench, Calendar, User, Eye } from "lucide-react";
import Link from "next/link";

interface WorkOrder {
  id: string;
  clienteNome: string;
  veiculo: string;
  placa: string;
  status: "orcamento" | "aguardando_peca" | "em_servico" | "finalizado";
  valorEstimado: number;
  createdAt: any;
}

export default function ListagemOSPage() {
  const { tenantId } = useTenant();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const qOrders = query(collection(db, "tenants", tenantId, "workOrders"), orderBy("createdAt", "desc"));
      const snapOrders = await getDocs(qOrders);
      setOrders(snapOrders.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkOrder[]);
    } catch (error) {
      console.error("Erro ao carregar OS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "orcamento": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "aguardando_peca": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "em_servico": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "finalizado": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "orcamento": return "Orçamento";
      case "aguardando_peca": return "Ag. Peça";
      case "em_servico": return "Em Serviço";
      case "finalizado": return "Finalizado";
      default: return status;
    }
  };

  const filteredOrders = orders.filter(os => 
    os.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    os.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wrench size={24} className="text-emerald-600" />
            Histórico de Ordens de Serviço
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Busque, filtre e visualize o histórico completo da oficina.</p>
        </div>
        <Link 
          href="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          Ir para o Painel (Dashboard)
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por placa, cliente ou número da OS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Carregando ordens de serviço...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-10 text-center border border-slate-200 dark:border-slate-700 border-dashed">
          <Wrench size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Nenhuma Ordem de Serviço</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">Nenhum registro encontrado no histórico.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">OS / Data</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Cliente</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Veículo</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Valor</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredOrders.map((os) => (
                  <tr key={os.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs font-bold text-slate-500 mb-1">#{os.id.slice(0,8).toUpperCase()}</div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar size={14} />
                        {os.createdAt?.toDate ? os.createdAt.toDate().toLocaleDateString('pt-BR') : 'Sem data'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                        <User size={16} className="text-slate-400" />
                        {os.clienteNome}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{os.veiculo}</div>
                      <div className="inline-block mt-1 px-2 py-0.5 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold">
                        {os.placa}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(os.status)}`}>
                        {getStatusLabel(os.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.valorEstimado || 0)}
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        href={`/o-1f2e3d4c/gestao?id=${os.id}`}
                        className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/50 p-2 rounded-lg transition-colors"
                        title="Ver Ordem de Serviço"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
