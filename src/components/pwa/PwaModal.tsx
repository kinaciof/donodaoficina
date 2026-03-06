"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export default function PwaModal() {
  const [showModal, setShowModal] = useState(false);
  const [os, setOs] = useState("");

  useEffect(() => {
    // Basic OS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("iOS");
    } else if (/android/.test(userAgent)) {
      setOs("Android");
    }

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isIOSStandalone = (window.navigator as any).standalone;

    if (!isStandalone && !isIOSStandalone && (os === "iOS" || os === "Android")) {
      // Don't show immediately on every load, maybe use localStorage to hide for a while if dismissed
      const dismissed = localStorage.getItem("pwa_prompt_dismissed");
      if (!dismissed) {
        // Small delay to not be too aggressive
        const timer = setTimeout(() => setShowModal(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [os]);

  if (!showModal) return null;

  const handleDismiss = () => {
    localStorage.setItem("pwa_prompt_dismissed", "true");
    setShowModal(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom-5">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-slate-400 hover:text-white"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>
      
      <div className="flex items-center gap-3">
        <div className="bg-emerald-600 p-2 rounded-lg text-white">
          <Download size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Instale o App</h3>
          <p className="text-slate-300 text-sm">Acesse mais rápido e offline.</p>
        </div>
      </div>
      
      <div className="mt-2 bg-slate-900 p-3 rounded-lg text-sm text-slate-300">
        {os === "iOS" ? (
          <p>Para instalar no iPhone, toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra do Safari e depois em <strong>&quot;Adicionar à Tela de Início&quot;</strong>.</p>
        ) : (
          <p>Para instalar no Android, toque no menu do navegador (três pontos) e selecione <strong>&quot;Adicionar à tela inicial&quot;</strong> ou clique no aviso de instalação se aparecer.</p>
        )}
      </div>
    </div>
  );
}