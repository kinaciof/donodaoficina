"use client";

import { useEffect, useState } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, getDocs, updateDoc, query, orderBy } from "firebase/firestore";
import { ArrowLeft, User, Car, Calendar, Wrench, Share2, Plus, Trash2, Printer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function GestaoOSContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { tenantId, tenantData } = useTenant();
  const [os, setOs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estoque e Form
  const [pecasEstoque, setPecasEstoque] = useState<any[]>([]);
  const [itens, setItens] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

  // Novo Item Form
  const [selectedPeca, setSelectedPeca] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [novoServicoNome, setNovoServicoNome] = useState("");
  const [novoServicoValor, setNovoServicoValor] = useState("");

  const fetchOS = async () => {
    if (!tenantId || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const docRef = doc(db, "tenants", tenantId, "workOrders", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setOs({ id: snap.id, ...data });
        setItens(data.itens || []);
        setServicos(data.servicos || []);
      }

      // Busca Estoque
      const qEstoque = query(collection(db, "tenants", tenantId, "pecas"), orderBy("nome", "asc"));
      const snapEstoque = await getDocs(qEstoque);
      setPecasEstoque(snapEstoque.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erro ao buscar OS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchOS();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, id]);

  const saveOSData = async (newItens: any[], newServicos: any[]) => {
    if (!tenantId || !id) return;
    try {
      // Recalcula o valorEstimado (Total) automaticamente
      const totalItens = newItens.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
      const totalServicos = newServicos.reduce((acc, s) => acc + Number(s.valor), 0);
      const novoTotal = totalItens + totalServicos;

      const docRef = doc(db, "tenants", tenantId, "workOrders", id as string);
      await updateDoc(docRef, {
        itens: newItens,
        servicos: newServicos,
        valorEstimado: novoTotal
      });
      
      setOs((prev: any) => ({ ...prev, valorEstimado: novoTotal }));
    } catch (error) {
      console.error("Erro ao atualizar OS:", error);
      alert("Erro ao salvar informações");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!tenantId || !id) return;
    try {
      const docRef = doc(db, "tenants", tenantId, "workOrders", id as string);
      await updateDoc(docRef, { status: newStatus });
      setOs((prev: any) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Erro ao mudar status", error);
    }
  };

  const adicionarPeca = () => {
    if (!selectedPeca || quantidade < 1) return;
    const pecaObj = pecasEstoque.find(p => p.id === selectedPeca);
    if (!pecaObj) return;

    const newItem = {
      id: Date.now().toString(),
      pecaId: pecaObj.id,
      nome: pecaObj.nome,
      quantidade,
      preco: pecaObj.precoVenda
    };
    
    const newItensList = [...itens, newItem];
    setItens(newItensList);
    saveOSData(newItensList, servicos);
    setSelectedPeca("");
    setQuantidade(1);
  };

  const adicionarServico = () => {
    if (!novoServicoNome || !novoServicoValor) return;
    const newServico = {
      id: Date.now().toString(),
      nome: novoServicoNome,
      valor: Number(novoServicoValor)
    };
    const newServicosList = [...servicos, newServico];
    setServicos(newServicosList);
    saveOSData(itens, newServicosList);
    setNovoServicoNome("");
    setNovoServicoValor("");
  };

  const removerItem = (itemId: string) => {
    const list = itens.filter(i => i.id !== itemId);
    setItens(list);
    saveOSData(list, servicos);
  };

  const removerServico = (servicoId: string) => {
    const list = servicos.filter(s => s.id !== servicoId);
    setServicos(list);
    saveOSData(itens, list);
  };

  const openWhatsApp = () => {
    if (!os) return;
    const texto = `Olá, *${os.clienteNome}*!\n\nAqui é da *${tenantData?.company_name || 'Oficina'}*.\nSua Ordem de Serviço para o *${os.veiculo}* (Placa: ${os.placa}) foi atualizada.\n\n🛠️ *Serviço:* ${os.descricao}\n📌 *Status:* ${os.status.toUpperCase().replace("_", " ")}\n💰 *Valor Total:* R$ ${os.valorEstimado.toFixed(2)}\n\nQualquer dúvida, estamos à disposição!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!os) {
    return <div className="text-center py-20">Ordem de serviço não encontrada.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:max-w-full print:p-0">
      
      {/* Print Header (Only visible on print) */}
      <div className="hidden print:flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          {tenantData?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tenantData.logoUrl} alt="Logo" className="w-24 h-24 object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-black uppercase">{tenantData?.company_name || 'Oficina'}</h1>
            <p className="text-sm text-slate-600">{tenantData?.endereco}{tenantData?.bairro ? `, ${tenantData.bairro}` : ''}</p>
            <p className="text-sm text-slate-600">{tenantData?.cidade}{tenantData?.uf ? ` - ${tenantData.uf}` : ''} {tenantData?.cep ? ` | CEP: ${tenantData.cep}` : ''}</p>
            <p className="text-sm font-bold mt-1">Tel: {tenantData?.phone || 'Não informado'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-300">ORDEM DE SERVIÇO</h2>
          <p className="text-lg font-bold">Nº {os.id.slice(0,8).toUpperCase()}</p>
          <p className="text-sm text-slate-600">Data: {os.createdAt?.toDate ? os.createdAt.toDate().toLocaleDateString('pt-BR') : 'Sem data'}</p>
        </div>
      </div>

      {/* Header / Navegação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link href="/" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-2">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Printer size={18} /> Imprimir (PDF)
          </button>
          <button onClick={openWhatsApp} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Share2 size={18} /> WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden print:shadow-none print:border-none">
        {/* Top Info da O.S */}
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 print:p-0 print:bg-white print:border-none">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="print:w-full print:mb-6">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-wide print:hidden">
                Ordem de Serviço
              </h1>
              <p className="text-slate-500 dark:text-slate-400 print:hidden">ID: <span className="font-mono">{os.id.slice(0,8).toUpperCase()}</span></p>
              
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <User size={18} className="text-slate-400" />
                  {os.clienteNome}
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Car size={18} className="text-slate-400" />
                  {os.veiculo} <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs ml-2">{os.placa}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Calendar size={18} className="text-slate-400" />
                  Abertura: {os.createdAt?.toDate ? os.createdAt.toDate().toLocaleDateString('pt-BR') : 'Sem data'}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between min-w-[200px] print:hidden">
              <div className="w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Atual</label>
                <select 
                  value={os.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="orcamento">Orçamento</option>
                  <option value="aguardando_peca">Aguardando Peça</option>
                  <option value="em_servico">Em Serviço</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div className="text-right mt-8">
                <p className="text-sm font-bold text-slate-500 mb-1">Valor Total Estimado</p>
                <p className="text-4xl font-black text-emerald-600 dark:text-emerald-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.valorEstimado || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Descrição / Defeito</h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{os.descricao}</p>
          </div>
        </div>

        {/* Adicionar Peças e Serviços */}
        <div className="p-6 md:p-8 space-y-10 print:p-0 print:mt-6">
          
          {/* Sessão de Peças */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 print:text-black">
              <Wrench size={20} className="text-emerald-600 print:hidden" /> Peças Utilizadas
            </h2>
            
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex flex-col sm:flex-row gap-3 print:hidden">
              <div className="flex-1">
                <select 
                  value={selectedPeca} 
                  onChange={(e) => setSelectedPeca(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none"
                >
                  <option value="">Selecione uma peça do estoque...</option>
                  {pecasEstoque.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} - R$ {p.precoVenda}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-24">
                <input 
                  type="number" 
                  min="1"
                  value={quantidade} 
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none text-center"
                />
              </div>
              <button 
                onClick={adicionarPeca}
                className="bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-700 dark:hover:bg-white transition-colors"
              >
                <Plus size={18} /> Inserir
              </button>
            </div>

            {itens.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 italic">Nenhuma peça adicionada ao serviço ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 text-slate-500">Descrição da Peça</th>
                      <th className="pb-2 text-center text-slate-500">Qtd</th>
                      <th className="pb-2 text-right text-slate-500">Valor Unit.</th>
                      <th className="pb-2 text-right text-slate-500">Subtotal</th>
                      <th className="pb-2 text-center text-slate-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {itens.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{item.nome}</td>
                        <td className="py-3 text-center">{item.quantidade}x</td>
                        <td className="py-3 text-right">R$ {item.preco.toFixed(2)}</td>
                        <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-300">R$ {(item.quantidade * item.preco).toFixed(2)}</td>
                        <td className="py-3 text-center print:hidden">
                          <button onClick={() => removerItem(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sessão de Mão de Obra */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 print:text-black">
              <Wrench size={20} className="text-emerald-600 print:hidden" /> Mão de Obra / Serviços
            </h2>
            
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 flex flex-col sm:flex-row gap-3 print:hidden">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={novoServicoNome} 
                  onChange={(e) => setNovoServicoNome(e.target.value)}
                  placeholder="Descrição do serviço (Ex: Mão de obra mecânica)"
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none"
                />
              </div>
              <div className="w-full sm:w-32">
                <input 
                  type="number" 
                  step="0.01"
                  value={novoServicoValor} 
                  onChange={(e) => setNovoServicoValor(e.target.value)}
                  placeholder="Valor (R$)"
                  className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none"
                />
              </div>
              <button 
                onClick={adicionarServico}
                className="bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-700 dark:hover:bg-white transition-colors"
              >
                <Plus size={18} /> Inserir
              </button>
            </div>

            {servicos.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 italic">Nenhum serviço de mão de obra adicionado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 text-slate-500">Descrição do Serviço</th>
                      <th className="pb-2 text-right text-slate-500">Subtotal</th>
                      <th className="pb-2 text-center text-slate-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {servicos.map((servico) => (
                      <tr key={servico.id}>
                        <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{servico.nome}</td>
                        <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-300">R$ {Number(servico.valor).toFixed(2)}</td>
                        <td className="py-3 text-center w-12 print:hidden">
                          <button onClick={() => removerServico(servico.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Print Total Area */}
          <div className="hidden print:block mt-8 pt-4 border-t-2 border-slate-800 text-right">
            <p className="text-lg font-bold text-slate-600 uppercase">Total a Pagar</p>
            <p className="text-4xl font-black text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.valorEstimado || 0)}
            </p>
            
            <div className="mt-16 flex justify-around items-center pt-8 border-t border-slate-300">
              <div className="text-center w-64">
                <div className="border-t border-slate-800 mb-2"></div>
                <p className="text-xs uppercase font-bold text-slate-600">Assinatura da Oficina</p>
              </div>
              <div className="text-center w-64">
                <div className="border-t border-slate-800 mb-2"></div>
                <p className="text-xs uppercase font-bold text-slate-600">Assinatura do Cliente</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function GestaoOS() {
  return (
    <Suspense fallback={<div className="text-center py-20">Carregando informações...</div>}>
      <GestaoOSContent />
    </Suspense>
  );
}
