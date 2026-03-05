export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-inner">
            DO
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Dono da Oficina</h1>
        </div>
        <nav className="hidden md:flex gap-6 font-medium">
          <a href="#" className="hover:text-blue-200 transition-colors">Painel</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Clientes</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Serviços</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-24 text-center">
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl max-w-2xl w-full border border-slate-100 dark:border-slate-700">
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            Bem-vindo ao Dono da Oficina!
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Seu sistema completo para gestão de oficinas mecânicas. Comece agora organizando seus clientes e criando novas ordens de serviço.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105">
              + Nova Ordem de Serviço
            </button>
            <button className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all">
              Cadastrar Cliente
            </button>
          </div>
        </div>

        {/* Dashboard Placeholder */}
        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Ordens Hoje</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">12</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Faturamento</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">R$ 4.350</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-orange-500">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Serviços Pendentes</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">5</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
        &copy; {new Date().getFullYear()} Dono da Oficina. Todos os direitos reservados.
      </footer>
    </div>
  );
}
