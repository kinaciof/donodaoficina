"use client";

import { FileText, Download, AlertCircle, TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FiscalPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockNotas = [
    { id: "1001", os: "3B8C9A", cliente: "Maria Souza", valor: 1540.00, status: "emitida", data: "Hoje" },
    { id: "1000", os: "7F2E1D", cliente: "João Pedro", valor: 350.00, status: "emitida", data: "Ontem" },
    { id: "999", os: "1A4B9C", cliente: "Empresa XPTO", valor: 8900.00, status: "erro", data: "05/03/2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText size={24} className="text-emerald-600" />
            Módulo Fiscal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emissão de Notas Fiscais (NFS-e e NF-e) e gestão tributária.</p>
        </div>
        <button className="bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 px-4 py-2.5 rounded-lg font-bold shadow-sm transition-colors opacity-70 cursor-not-allowed">
          Conectar Certificado Digital
        </button>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-orange-800 dark:text-orange-300">Módulo em Desenvolvimento</h3>
          <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
            Esta é uma interface de demonstração. Em breve você poderá conectar o seu Certificado Digital A1 e emitir notas automaticamente a partir de cada Ordem de Serviço finalizada, integrando com a prefeitura da sua cidade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Notas Emitidas (Mês)</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100">42</h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Impostos Estimados</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            R$ 845,90 <TrendingUp size={20} className="text-red-500" />
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Faturamento Declarado</p>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-500">
            R$ 10.790,00
          </h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Últimas Notas Geradas</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar nota..." className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 font-semibold text-slate-500">Número da Nota</th>
              <th className="p-4 font-semibold text-slate-500">O.S Origem</th>
              <th className="p-4 font-semibold text-slate-500">Tomador (Cliente)</th>
              <th className="p-4 font-semibold text-slate-500">Valor</th>
              <th className="p-4 font-semibold text-slate-500">Status Sefaz</th>
              <th className="p-4 font-semibold text-slate-500 text-center">Baixar PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {mockNotas.map((nota) => (
              <tr key={nota.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-bold text-slate-800 dark:text-slate-200">NFS-e {nota.id}</td>
                <td className="p-4 font-mono text-slate-500">
                  <Link href={`/dd302f94682dbd2a114d63b0433602e0/gestao?id=${nota.os}`} className="hover:underline hover:text-emerald-600">
                    {nota.os}
                  </Link>
                </td>
                <td className="p-4">{nota.cliente}</td>
                <td className="p-4 font-medium">R$ {nota.valor.toFixed(2)}</td>
                <td className="p-4">
                  {nota.status === 'emitida' ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">Autorizada</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">Rejeitada</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors p-1.5">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
