import Link from 'next/link';
import { Calendar, Package, DollarSign, Settings } from 'lucide-react';
import { EducationalFooter } from '@/components/ui/EducationalFooter';
import { Tooltip } from '@/components/ui/Tooltip';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-700 font-bold text-xl shadow-inner">
            DO
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Dono da Oficina</h1>
        </div>
        <nav className="hidden md:flex gap-6 font-medium items-center">
          <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Painel</Link>
          <Link href="/3a502f6b86d9a18016f4d38c64e5264f" className="flex items-center gap-1 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-md transition-colors shadow-sm">
            <Settings size={18} />
            <span>Configurações</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              Visão Geral da Oficina
            </h2>
            <p className="text-slate-400">
              Gerencie seus agendamentos, estoque e faturamento em um só lugar.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card Agendamentos */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Agendamentos</h3>
                  <Tooltip content="Total de veículos agendados para manutenção hoje." />
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Calendar size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">8</p>
              <p className="text-sm text-foreground/60">Veículos para hoje</p>
            </div>

            {/* Card Estoque */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Estoque</h3>
                  <Tooltip content="Quantidade de peças e produtos disponíveis no inventário da oficina." />
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Package size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">142</p>
              <p className="text-sm text-foreground/60">Peças disponíveis</p>
            </div>

            {/* Card Financeiro */}
            <div className="bg-card p-6 rounded-xl shadow-md border border-border hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">Financeiro</h3>
                  <Tooltip content="Total faturado considerando apenas as ordens de serviço concluídas e pagas nesta semana." />
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <DollarSign size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-1">R$ 3.250</p>
              <p className="text-sm text-foreground/60">Faturado esta semana</p>
            </div>

          </div>
        </div>
      </main>
      
      <EducationalFooter description="O Painel de Visão Geral permite o acompanhamento em tempo real das principais métricas da sua oficina, ajudando na tomada de decisão rápida." />
    </div>
  );
}