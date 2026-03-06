import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-lg py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-700 font-bold text-xl shadow-inner">
            DO
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Configurações</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center p-6 md:p-12">
        <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-md border border-slate-700">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">
              Perfil da Oficina
            </h2>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Voltar para Home</span>
            </Link>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="nomeOficina" className="block text-sm font-medium text-slate-300 mb-1">
                Nome da Oficina
              </label>
              <input
                type="text"
                id="nomeOficina"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ex: Auto Center São Paulo"
                defaultValue="Minha Oficina"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-1">
                Telefone de Contato
              </label>
              <input
                type="text"
                id="telefone"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-slate-300 mb-1">
                Endereço
              </label>
              <textarea
                id="endereco"
                rows={3}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Rua, Número, Bairro, Cidade"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors"
              >
                <Save size={18} />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        &copy; {new Date().getFullYear()} Dono da Oficina. Todos os direitos reservados.
      </footer>
    </div>
  );
}