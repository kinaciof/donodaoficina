"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Plus, Wrench, MoreVertical, Calendar, User, TrendingUp, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface WorkOrder {
  id: string;
  clienteId: string;
  clienteNome: string;
  veiculo: string;
  placa: string;
  status: "orcamento" | "aguardando_peca" | "em_servico" | "finalizado";
  descricao: string;
  valorEstimado: number;
  createdAt: any;
}

interface Cliente {
  id: string;
  nome: string;
  veiculos: { placa: string; marca: string; modelo: string }[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const { tenantId, tenantData } = useTenant();
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form OS
  const [selectedCliente, setSelectedCliente] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  
  // BI States
  const [biData, setBiData] = useState({
    totalAberto: 0,
    totalFinalizado: 0,
    faturamentoPrevisto: 0,
    faturamentoRealizado: 0,
    chartData: [] as any[]
  });

  const fetchData = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      // Busca OS
      const qOrders = query(collection(db, "tenants", tenantId, "workOrders"), orderBy("createdAt", "desc"));
      const snapOrders = await getDocs(qOrders);
      const ordersData = snapOrders.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkOrder[];
      setOrders(ordersData);

      // Calcular BI Metrics
      let aberto = 0;
      let finalizado = 0;
      let fatPrevisto = 0;
      let fatRealizado = 0;
      const statusCount: any = { orcamento: 0, aguardando_peca: 0, em_servico: 0, finalizado: 0 };

      ordersData.forEach(os => {
        if (os.status === "finalizado") {
          finalizado++;
          fatRealizado += (os.valorEstimado || 0);
        } else {
          aberto++;
          fatPrevisto += (os.valorEstimado || 0);
        }
        statusCount[os.status] += 1;
      });

      setBiData({
        totalAberto: aberto,
        totalFinalizado: finalizado,
        faturamentoPrevisto: fatPrevisto,
        faturamentoRealizado: fatRealizado,
        chartData: [
          { name: "Orçamento", value: statusCount.orcamento, color: "#3b82f6" },
          { name: "Ag. Peça", value: statusCount.aguardando_peca, color: "#f97316" },
          { name: "Em Serviço", value: statusCount.em_servico, color: "#a855f7" },
          { name: "Finalizado", value: statusCount.finalizado, color: "#10b981" },
        ]
      });

      // Busca Clientes para o select do modal
      const qClientes = query(collection(db, "tenants", tenantId, "clientes"), orderBy("nome", "asc"));
      const snapClientes = await getDocs(qClientes);
      setClientes(snapClientes.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Cliente[]);

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchData();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handleCreateOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !selectedCliente) return;

    const clienteObj = clientes.find(c => c.id === selectedCliente);
    if (!clienteObj || !clienteObj.veiculos[0]) {
      alert("Cliente inválido ou sem veículo cadastrado.");
      return;
    }

    try {
      await addDoc(collection(db, "tenants", tenantId, "workOrders"), {
        clienteId: clienteObj.id,
        clienteNome: clienteObj.nome,
        veiculo: `${clienteObj.veiculos[0].marca} ${clienteObj.veiculos[0].modelo}`,
        placa: clienteObj.veiculos[0].placa,
        status: "orcamento",
        descricao,
        valorEstimado: Number(valor) || 0,
        createdAt: Timestamp.now()
      });
      
      setIsModalOpen(false);
      setDescricao(""); setValor(""); setSelectedCliente("");
      fetchData();
    } catch (error) {
      console.error("Erro criar OS:", error);
      alert("Erro ao criar Ordem de Serviço.");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "orcamento": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "aguardando_peca": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "em_servico": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "finalizado": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case "orcamento": return "Orçamento";
      case "aguardando_peca": return "Aguardando Peça";
      case "em_servico": return "Em Serviço";
      case "finalizado": return "Finalizado";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Olá, {user?.displayName || tenantData?.company_name || 'Dono da Oficina'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Aqui está o resumo das suas ordens de serviço hoje.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Nova Ordem de Serviço</span>
          </button>
        </div>
      </div>

      {/* Dashboards Financeiros */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Wrench size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">O.S. em Aberto</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{biData.totalAberto}</h3>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <CircleDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Receita Prevista</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(biData.faturamentoPrevisto)}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Faturado (Finalizadas)</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(biData.faturamentoRealizado)}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico e Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Gráfico */}
        {!loading && orders.length > 0 && (
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Status dos Serviços</h2>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={biData.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {biData.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Lista O.S. */}
        <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${loading || orders.length === 0 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Ordens de Serviço Recentes
            </h2>
            <Link href="/dd302f94682dbd2a114d63b0433602e0" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg transition-colors">
              Ver Histórico Completo
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <Wrench size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Nenhuma Ordem de Serviço</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">Você ainda não tem serviços cadastrados. Adicione um cliente e crie a primeira O.S.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-emerald-600 font-bold hover:underline">
                Criar primeira O.S.
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.slice(0, 6).map((os) => (
                <Link href={`/dd302f94682dbd2a114d63b0433602e0/gestao?id=${os.id}`} key={os.id} className="block">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors relative group h-full">
                    
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getStatusColor(os.status)}`}>
                        {getStatusLabel(os.status)}
                      </span>
                      <MoreVertical size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">{os.veiculo}</h3>
                    
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <User size={12} /> <span className="truncate">{os.clienteNome}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="text-xs font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                        {os.placa}
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.valorEstimado || 0)}
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Nova OS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Criar Orçamento (O.S.)</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOS} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Selecione o Cliente *</label>
                {clientes.length === 0 ? (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded text-sm mb-2 border border-orange-200 dark:border-orange-800">
                    Você não tem clientes cadastrados. <Link href="/0670acdde4e1e38b56697bc77166b4ef" className="font-bold underline">Cadastre um cliente</Link> primeiro.
                  </div>
                ) : (
                  <select 
                    required 
                    value={selectedCliente} 
                    onChange={e => setSelectedCliente(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">-- Selecione --</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome} ({c.veiculos[0]?.placa || 'Sem placa'})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Defeito Reclamado / Descrição *</label>
                <textarea 
                  required 
                  value={descricao} 
                  onChange={e => setDescricao(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]" 
                  placeholder="Ex: Cliente relata barulho na suspensão dianteira ao passar em buracos..." 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor Estimado Inicial (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={valor} 
                  onChange={e => setValor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="0.00" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 rounded-lg">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={clientes.length === 0}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm"
                >
                  Criar O.S.
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
