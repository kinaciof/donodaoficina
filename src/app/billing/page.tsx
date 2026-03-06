"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, CheckCircle2, ShieldAlert } from "lucide-react";

export default function BillingPage() {
  const { isExpired, trialEndsAt } = useAuth();
  
  const handleCheckout = () => {
    alert("Redirecionando para o Checkout (Stripe)...");
    // Futuro: window.location.href = STRIPE_CHECKOUT_URL;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {isExpired && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-5 flex items-start gap-4">
          <ShieldAlert size={28} className="text-red-600 mt-1 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-red-800 dark:text-red-300">Seu período de testes ou assinatura expirou.</h2>
            <p className="text-red-600 dark:text-red-400 mt-1">
              O acesso ao sistema foi bloqueado temporariamente. Para continuar utilizando todas as funcionalidades do Dono da Oficina, escolha um plano abaixo.
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Planos e Assinaturas</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {!isExpired && trialEndsAt ? (
            <span>Você tem até <strong>{trialEndsAt.toLocaleDateString()}</strong> para usar gratuitamente.</span>
          ) : (
            "Escolha o melhor plano para o tamanho da sua oficina."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Plano Essencial</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Ideal para oficinas em crescimento.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-slate-800 dark:text-white">R$ 97</span>
            <span className="text-slate-500">/mês</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {['Até 50 Ordens de Serviço / mês', 'Gestão de Clientes e Veículos', 'Suporte por e-mail'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={handleCheckout}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl transition-colors"
          >
            Assinar Essencial
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-emerald-600 rounded-2xl shadow-xl p-8 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 right-8 transform -translate-y-1/2">
            <span className="bg-orange-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Recomendado</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Plano Profissional</h3>
          <p className="text-emerald-100 mb-6">Para centros automotivos que querem escalar.</p>
          <div className="mb-6 text-white">
            <span className="text-4xl font-extrabold">R$ 197</span>
            <span className="text-emerald-200">/mês</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {['Ordens de Serviço Ilimitadas', 'Módulo Fiscal Avançado (NFe)', 'Portal do Cliente com WhatsApp', 'Dashboard Financeiro', 'Suporte Prioritário'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-white">
                <CheckCircle2 size={18} className="text-emerald-200" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={handleCheckout}
            className="w-full py-3 px-4 bg-white text-emerald-700 hover:bg-slate-50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <CreditCard size={20} />
            <span>Assinar Profissional</span>
          </button>
        </div>
      </div>
    </div>
  );
}
