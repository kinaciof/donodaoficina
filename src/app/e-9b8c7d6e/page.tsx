"use client";

import { useState, useEffect } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { Plus, Search, Package, TrendingUp, X } from "lucide-react";

interface Peca {
  id: string;
  nome: string;
  codigo: string;
  quantidade: number;
  precoCusto: number;
  precoVenda: number;
  createdAt: any;
}

export default function EstoquePage() {
  const { tenantId } = useTenant();
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");

  const fetchPecas = async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "tenants", tenantId, "pecas"),
        orderBy("nome", "asc")
      );
      const snapshot = await getDocs(q);
      const pecasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Peca[];
      setPecas(pecasData);
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPecas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    try {
      await addDoc(collection(db, "tenants", tenantId, "pecas"), {
        nome,
        codigo: codigo || "SEM-CODIGO",
        quantidade: Number(quantidade) || 0,
        precoCusto: Number(precoCusto) || 0,
        precoVenda: Number(precoVenda) || 0,
        createdAt: Timestamp.now()
      });
      
      setIsModalOpen(false);
      setNome(""); setCodigo(""); setQuantidade("");
      setPrecoCusto(""); setPrecoVenda("");
      fetchPecas();
    } catch (error) {
      console.error("Erro ao salvar peça:", error);
      alert("Erro ao salvar peça no estoque.");
    }
  };

  const filteredPecas = pecas.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Package size={24} className="text-emerald-600" />
            Estoque de Peças
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Controle suas peças e produtos para as ordens de serviço.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center shadow-sm"
        >
          <Plus size={18} />
          Nova Peça
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou código do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      ) : filteredPecas.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-10 text-center border border-slate-200 dark:border-slate-700 border-dashed">
          <Package size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Estoque Vazio</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">Adicione as peças que você mais utiliza para facilitar a criação de orçamentos.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-emerald-600 font-medium hover:underline">
            Adicionar primeira peça
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Produto</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Código</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-center">Em Estoque</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Preço de Venda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredPecas.map((peca) => (
                  <tr key={peca.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{peca.nome}</td>
                    <td className="p-4 font-mono text-sm text-slate-500 dark:text-slate-400">{peca.codigo}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${peca.quantidade <= 2 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {peca.quantidade} un.
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(peca.precoVenda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Adicionar Peça ao Estoque</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Peça/Produto *</label>
                <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Filtro de Óleo Fram" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Código / Referência</label>
                  <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm" placeholder="SKU-123" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantidade Inicial *</label>
                  <input type="number" required min="0" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preço de Custo (R$)</label>
                  <input type="number" step="0.01" value={precoCusto} onChange={e => setPrecoCusto(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    Preço de Venda (R$) * <TrendingUp size={14} className="text-emerald-500" />
                  </label>
                  <input type="number" step="0.01" required value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-700 dark:text-emerald-400" placeholder="0.00" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                  Salvar Peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
