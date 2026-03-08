"use client";

import { useState, useEffect } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { Plus, Search, Car, Phone, User, X } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  veiculos: {
    placa: string;
    marca: string;
    modelo: string;
    ano: string;
  }[];
  createdAt: any;
}

export default function ClientesPage() {
  const { tenantId } = useTenant();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
      } else {
        alert("CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setLoadingCep(false);
    }
  };

  const fetchClientes = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "tenants", tenantId, "clientes"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const clientesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      setClientes(clientesData);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchClientes();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    try {
      const fullAddress = `${endereco}${bairro ? `, ${bairro}` : ''}${cidade ? ` - ${cidade}/${uf}` : ''}${cep ? ` (CEP: ${cep})` : ''}`;
      
      await addDoc(collection(db, "tenants", tenantId, "clientes"), {
        nome,
        telefone,
        endereco: fullAddress,
        veiculos: [
          {
            placa: placa.toUpperCase(),
            marca,
            modelo,
            ano
          }
        ],
        createdAt: Timestamp.now()
      });
      
      setIsModalOpen(false);
      // Limpa os campos
      setNome(""); setTelefone(""); setCep(""); setEndereco("");
      setBairro(""); setCidade(""); setUf("");
      setPlaca(""); setMarca(""); setModelo(""); setAno("");
      // Recarrega a lista
      fetchClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente.");
    }
  };

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.veiculos.some(v => v.placa.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Clientes e Veículos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie sua base de clientes e a frota.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      {loading ? (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Carregando clientes...</p>
        </div>
      ) : filteredClientes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Nenhum cliente encontrado</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Comece adicionando seu primeiro cliente e veículo.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-emerald-600 font-medium hover:text-emerald-700"
          >
            + Cadastrar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-1">{cliente.nome}</h3>
                </div>
                <div className="space-y-1 mt-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone size={14} />
                    <span>{cliente.telefone || "Sem telefone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <User size={14} />
                    <span className="truncate">{cliente.endereco || "Sem endereço"}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Veículos ({cliente.veiculos?.length || 0})</h4>
                <div className="space-y-2">
                  {cliente.veiculos?.map((veiculo, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-700 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 dark:bg-slate-600 p-1.5 rounded">
                          <Car size={16} className="text-slate-600 dark:text-slate-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{veiculo.marca} {veiculo.modelo}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Ano {veiculo.ano}</p>
                        </div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        {veiculo.placa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Novo Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Novo Cliente e Veículo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Dados do Cliente */}
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 border-l-4 border-emerald-500 pl-2">
                  Dados do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                    <input type="text" required value={nome} onChange={e => setNome(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Maria Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp *</label>
                    <input type="text" required value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="(11) 99999-9999" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CEP</label>
                    <div className="flex gap-2">
                      <input type="text" value={cep} onChange={e => setCep(e.target.value)} onBlur={buscarCep} maxLength={9} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="00000-000" />
                      <button type="button" onClick={buscarCep} disabled={loadingCep} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 rounded-lg flex items-center justify-center transition-colors">
                        <Search size={18} className="text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rua / Logradouro</label>
                    <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Rua exemplo, 123" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bairro</label>
                    <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Bairro" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                    <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Cidade" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UF</label>
                    <input type="text" value={uf} onChange={e => setUf(e.target.value)} maxLength={2} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none uppercase" placeholder="SP" />
                  </div>
                </div>
              </div>

              {/* Dados do Veículo */}
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 border-l-4 border-blue-500 pl-2 mt-2">
                  Veículo Principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Placa *</label>
                    <input type="text" required value={placa} onChange={e => setPlaca(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-mono" placeholder="ABC-1234" maxLength={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marca *</label>
                    <input type="text" required value={marca} onChange={e => setMarca(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Chevrolet" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Modelo *</label>
                    <input type="text" required value={modelo} onChange={e => setModelo(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Onix 1.0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ano</label>
                    <input type="text" value={ano} onChange={e => setAno(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: 2020" maxLength={4} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
