import Link from 'next/link';
import { Calendar, Package, DollarSign, Settings, Car, Users, AlertTriangle } from 'lucide-react';
import { EducationalFooter } from '@/components/ui/EducationalFooter';
import { Tooltip } from '@/components/ui/Tooltip';

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start">
        <div className="w-full max-w-6xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2">
                Centro de Comando
              </h2>
              <p className="text-foreground/70">
                Acompanhe o pulso da sua oficina em tempo real.
              </p>
            </div>
            
            {/* Widget de Alerta de Estoque Crítico */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3 flex items-center gap-3 shadow-sm">
              <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-1">
                  Estoque Crítico
                  <Tooltip content="Itens que atingiram a quantidade mínima configurada e precisam de reposição urgente." />
                </h4>
                <p className="text-xs text-red-600 dark:text-red-400">5 itens abaixo do mínimo</p>
              </div>
              <button className="ml-auto text-xs font-semibold bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors">
                Verificar
              </button>
            </div>
          </div>

          {/* Cards Grid - KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* KPI: OS Ativas */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider group-hover:text-primary transition-colors">OS Ativas</h3>
                  <Tooltip content="Total de Ordens de Serviço atualmente em andamento na oficina." />
                </div>
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Calendar size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">12</p>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                +2 desde ontem
              </p>
            </div>

            {/* KPI: Veículos no Pátio */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider group-hover:text-primary transition-colors">Veículos</h3>
                  <Tooltip content="Número de veículos fisicamente presentes no pátio hoje." />
                </div>
                <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Car size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">15</p>
              <p className="text-xs text-foreground/60 font-medium">
                80% da capacidade
              </p>
            </div>

            {/* KPI: Novos Clientes */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider group-hover:text-primary transition-colors">Clientes (Mês)</h3>
                  <Tooltip content="Novos clientes cadastrados no mês atual." />
                </div>
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">24</p>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                +15% vs mês anterior
              </p>
            </div>

            {/* KPI: Faturamento Diário */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider group-hover:text-primary transition-colors">Faturamento Hoje</h3>
                  <Tooltip content="Valor total das Ordens de Serviço finalizadas e pagas no dia de hoje." />
                </div>
                <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <DollarSign size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">R$ 1.850</p>
              <p className="text-xs text-foreground/60 font-medium">
                Meta diária: R$ 2.000
              </p>
            </div>

          </div>
        </div>
      </main>
      
      <EducationalFooter description="O Centro de Comando oferece uma visão panorâmica instantânea da saúde da sua oficina, destacando métricas vitais e alertas que exigem sua atenção imediata." />
    </div>
  );
}