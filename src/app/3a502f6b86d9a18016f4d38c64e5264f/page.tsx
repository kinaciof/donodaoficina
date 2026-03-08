"use client";

import { useState, useEffect } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { db, storage } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Settings, Save, Image as ImageIcon, MapPin, Building, Phone } from "lucide-react";

export default function ConfigPage() {
  const { tenantId, tenantData } = useTenant();
  const [loading, setLoading] = useState(false);
  
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (tenantData) {
      setCompanyName(tenantData.company_name || "");
      setPhone(tenantData.phone || "");
      setCep(tenantData.cep || "");
      setEndereco(tenantData.endereco || "");
      setBairro(tenantData.bairro || "");
      setCidade(tenantData.cidade || "");
      setUf(tenantData.uf || "");
      setLogoUrl(tenantData.logoUrl || "");
    }
  }, [tenantData]);

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tenantId) return;

    setUploadingLogo(true);
    try {
      const storageRef = ref(storage, `tenants/${tenantId}/config/logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setLogoUrl(url);
      
      // Update in firestore immediately
      const tenantRef = doc(db, "tenants", tenantId);
      await updateDoc(tenantRef, { logoUrl: url });
    } catch (error) {
      console.error("Erro ao subir logo:", error);
      alert("Falha ao enviar imagem. Verifique as regras do Firebase Storage.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    
    setLoading(true);
    try {
      const tenantRef = doc(db, "tenants", tenantId);
      await updateDoc(tenantRef, {
        company_name: companyName,
        phone,
        cep,
        endereco,
        bairro,
        cidade,
        uf,
        logoUrl
      });
      alert("Configurações salvas com sucesso! Recarregue a página para ver todas as alterações.");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="text-emerald-600" /> Configurações da Oficina
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Personalize sua logomarca e endereço. Estes dados sairão na impressão das suas Ordens de Serviço.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          
          {/* Logo Section */}
          <div className="flex flex-col sm:flex-row gap-8 items-start border-b border-slate-200 dark:border-slate-700 pb-8">
            <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 overflow-hidden shrink-0 relative group">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo da Oficina" className="w-full h-full object-contain p-2" />
              ) : (
                <ImageIcon size={32} className="text-slate-400" />
              )}
              
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity text-xs font-bold uppercase tracking-wider">
                {uploadingLogo ? "Enviando..." : "Trocar"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
              </label>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Logomarca</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Envie uma imagem JPG ou PNG. Recomendamos o formato quadrado com fundo transparente.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"><Building size={16} /> Nome Oficial da Oficina</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"><Phone size={16} /> Telefone de Contato</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" placeholder="(11) 99999-9999" />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><MapPin size={20} className="text-slate-400" /> Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CEP</label>
                <div className="flex gap-2">
                  <input type="text" value={cep} onChange={e => setCep(e.target.value)} onBlur={buscarCep} maxLength={9} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rua / Logradouro</label>
                <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bairro</label>
                <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UF</label>
                <input type="text" value={uf} onChange={e => setUf(e.target.value)} maxLength={2} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 uppercase" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
              <Save size={20} />
              {loading ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
