"use client";

import { useState } from "react";
import { Search, Car, AlertCircle } from "lucide-react";
import { OS_STATUSES, OSStatusType } from "@/lib/os";
import { formatCurrency } from "@/lib/utils";

// This is a mocked version for the static demo.
// In the full implementation, this will query Firestore.
export default function ClientPortal() {
  const [searchValue, setSearchValue] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  // Mock data state
  const [osData, setOsData] = useState<{
    id: string;
    veiculo: string;
    placa: string;
    status: OSStatusType;
    descricao: string;
    valor: number;
    data: string;
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    
    setHasSearched(true);
    
    // Mocking a successful find if they type anything
    // Real implementation: const docs = await getDocs(query(collection(db, "os"), where("cpf", "==", searchValue)));
    setOsData({
      id: "OS-1024",
      veiculo: "Honda Civic EXL",
      placa: "ABC-1234",
      status: "em_servico",
      descricao: "Troca de pastilhas de freio e alinhamento/balanceamento.",
      valor: 850.00,
      data: new Date().toLocaleDateString('pt-BR')
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="bg-primary text-primary-foreground py-6 px-6 text-center shadow-md no-print">
        <h1 className="text-2xl font-bold">Portal do Cliente</h1>
        <p className="text-primary-foreground/80 mt-1">Acompanhe o status do seu veículo</p>
      </header>

      <main className="flex-grow flex flex-col items-center p-6 md:p-12">
        <div className="w-full max-w-lg">
          
          <div className="bg-card p-8 rounded-2xl shadow-xl border border-border no-print">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <label htmlFor="search" className="text-sm font-semibold text-foreground">
                Digite seu CPF ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-foreground/50" size={18} />
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                />
              </div>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-colors"
              >
                Buscar Ordem de Serviço
              </button>
            </form>
          </div>

          {hasSearched && osData && (
            <div className="mt-8 animate-in slide-in-from-bottom-4">
              <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden print-container">
                
                <div className="bg-slate-100 dark:bg-slate-800 p-6 border-b border-border flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Ordem de Serviço</p>
                    <h2 className="text-2xl font-black text-foreground">{osData.id}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Data</p>
                    <p className="text-foreground font-medium">{osData.data}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary mt-1">
                      <Car size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{osData.veiculo}</h3>
                      <p className="text-foreground/60 font-mono">{osData.placa}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-3">Status Atual</p>
                    
                    {(() => {
                      const statusConfig = OS_STATUSES[osData.status];
                      const Icon = statusConfig.icon;
                      return (
                        <div className={`flex items-center gap-3 p-4 rounded-xl border ${statusConfig.bgColorClass} border-transparent`}>
                          <Icon className={statusConfig.colorClass} size={28} />
                          <span className={`text-lg font-bold ${statusConfig.colorClass}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="border-t border-border pt-6">
                    <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-2">Descrição do Problema</p>
                    <p className="text-foreground leading-relaxed">
                      {osData.descricao}
                    </p>
                  </div>

                  <div className="border-t border-border pt-6 flex justify-between items-end">
                    <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest">Valor Total Estimado</p>
                    <p className="text-3xl font-black text-foreground">
                      {formatCurrency(osData.valor)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center gap-4 no-print">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground font-semibold rounded-lg transition-colors"
                >
                  Imprimir Comprovante
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}