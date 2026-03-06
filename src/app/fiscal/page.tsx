"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Building2, CheckCircle2, AlertTriangle, Send } from "lucide-react";

// Mock OS data for fiscal emission
const mockOSList = [
  { id: "1001", client: "Carlos Alberto Santos", value: "R$ 450,00", status: "Concluído", date: "15/02/2026", nfeStatus: "Pendente" },
  { id: "1002", client: "Mariana Costa Silva", value: "R$ 850,00", status: "Em Serviço", date: "05/03/2026", nfeStatus: "Não Elegível" },
  { id: "1003", client: "Roberto Almeida", value: "R$ 1.200,00", status: "Entregue", date: "10/03/2026", nfeStatus: "Pendente" },
  { id: "1004", client: "Juliana Mendes", value: "R$ 3.500,00", status: "Concluído", date: "20/08/2025", nfeStatus: "Emitida" },
];

export default function FiscalPage() {
  const { tenantId } = useAuth();
  const [selectedCnpj, setSelectedCnpj] = useState("11.111.111/0001-11");
  const [emitting, setEmitting] = useState<string | null>(null);

  const handleEmitNFe = (osId: string) => {
    setEmitting(osId);
    
    // Simulate API call to Firebase Cloud Function -> FocusNF-e
    setTimeout(() => {
      alert(`Requisição de emissão da NFe para OS #${osId} enviada com sucesso para a fila de processamento!`);
      setEmitting(null);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <FileText className="text-emerald-600" />
          Módulo Fiscal
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie a emissão de Notas Fiscais (NFS-e / NF-e) através da integração com FocusNF-e.</p>
      </div>

      {/* CNPJ Selector (Multi-CNPJ support per Tenant) */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Empresa Emissora</h3>
            <p className="text-sm text-slate-500">Selecione o CNPJ para faturamento</p>
          </div>
        </div>
        
        <select 
          value={selectedCnpj}
          onChange={(e) => setSelectedCnpj(e.target.value)}
          className="w-full md:w-auto min-w-[250px] p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700 dark:text-slate-200"
        >
          <option value="11.111.111/0001-11">Oficina Matriz (11.111.111/0001-11)</option>
          <option value="22.222.222/0001-22">Auto Peças Filial (22.222.222/0001-22)</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-white">Ordens de Serviço (Faturamento)</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold">OS</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Status OS</th>
                <th className="p-4 font-semibold">Valor</th>
                <th className="p-4 font-semibold">Status NF-e</th>
                <th className="p-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {mockOSList.map((os) => {
                // Regra de Negócio: Só permite emitir NFe se a OS estiver Concluída ou Entregue.
                const canEmit = (os.status === 'Concluído' || os.status === 'Entregue') && os.nfeStatus === 'Pendente';
                
                return (
                  <tr key={os.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-white">#{os.id}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{os.client}</td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-700 dark:text-slate-300">
                        {os.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-white">{os.value}</td>
                    <td className="p-4">
                      {os.nfeStatus === 'Emitida' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                          <CheckCircle2 size={14} /> Emitida
                        </span>
                      )}
                      {os.nfeStatus === 'Pendente' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-500">
                          <AlertTriangle size={14} /> Pendente
                        </span>
                      )}
                      {os.nfeStatus === 'Não Elegível' && (
                        <span className="text-xs text-slate-400 font-medium">Não Elegível</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {canEmit ? (
                        <button 
                          onClick={() => handleEmitNFe(os.id)}
                          disabled={emitting === os.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                        >
                          {emitting === os.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Send size={16} />
                          )}
                          Emitir Nota
                        </button>
                      ) : (
                        <button disabled className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed">
                          Indisponível
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
