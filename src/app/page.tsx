import Link from 'next/link';
import { Calendar, Package, DollarSign, Settings } from 'lucide-react';

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
          <Link href="/" className="text-emerald-100 hover:text-white transition-colors">Painel</Link>
          <Link href="/settings" className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-md transition-colors shadow-sm">
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
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700 hover:border-emerald-500 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">Agendamentos</h3>
                <div className="p-3 bg-emerald-900/50 rounded-lg text-emerald-400">
                  <Calendar size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">8</p>
              <p className="text-sm text-slate-400">Veículos para hoje</p>
            </div>

            {/* Card Estoque */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700 hover:border-emerald-500 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">Estoque</h3>
                <div className="p-3 bg-emerald-900/50 rounded-lg text-emerald-400">
                  <Package size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">142</p>
              <p className="text-sm text-slate-400">Peças disponíveis</p>
            </div>

            {/* Card Financeiro */}
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700 hover:border-emerald-500 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">Financeiro</h3>
                <div className="p-3 bg-emerald-900/50 rounded-lg text-emerald-400">
                  <DollarSign size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">R$ 3.250</p>
              <p className="text-sm text-slate-400">Faturado esta semana</p>
            </div>

          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        &copy; {new Date().getFullYear()} Dono da Oficina. Todos os direitos reservados.
      </footer>
    </div>
  );
}