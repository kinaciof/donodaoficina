"use client";

import { useState } from "react";
import { Search, Plus, Phone, Car, MapPin, ChevronDown, ChevronUp, Clock, FileText } from "lucide-react";

// Fake Data for UI purposes
const mockClients = [
  {
    id: "1",
    name: "Carlos Alberto Santos",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    primaryVehicle: "Honda Civic - ABC-1234",
    address: "Rua das Flores, 123",
    history: [
      { os: "1001", date: "15/02/2026", status: "Concluído", value: "R$ 450,00", desc: "Troca de óleo e filtros" },
      { os: "954", date: "10/11/2025", status: "Concluído", value: "R$ 1.200,00", desc: "Revisão de 50.000km" }
    ]
  },
  {
    id: "2",
    name: "Mariana Costa Silva",
    cpf: "987.654.321-11",
    phone: "(11) 91234-5678",
    primaryVehicle: "Jeep Renegade - XYZ-9876",
    address: "Av. Paulista, 1000",
    history: [
      { os: "1045", date: "05/03/2026", status: "Em Serviço", value: "R$ 850,00", desc: "Troca de pastilhas de freio" }
    ]
  },
  {
    id: "3",
    name: "Roberto Almeida",
    cpf: "456.789.123-22",
    phone: "(11) 99988-7766",
    primaryVehicle: "VW Polo - QWE-5555",
    address: "Rua Augusta, 500",
    history: []
  },
  {
    id: "4",
    name: "Juliana Mendes",
    cpf: "321.654.987-33",
    phone: "(11) 97777-6666",
    primaryVehicle: "Fiat Toro - RTY-4444",
    address: "Av. Faria Lima, 200",
    history: [
      { os: "912", date: "20/08/2025", status: "Concluído", value: "R$ 3.500,00", desc: "Retífica de motor" }
    ]
  }
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredClients = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.primaryVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Gestão de Clientes</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Visualize e gerencie a carteira de clientes e seus veículos.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap">
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome, placa ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm dark:text-white"
        />
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
        {filteredClients.map((client) => (
          <div 
            key={client.id} 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
          >
            {/* Card Content */}
            <div className="p-5 flex-1">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 truncate">{client.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">CPF: {client.cpf}</p>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Phone size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <Car size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate font-medium">{client.primaryVehicle}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <MapPin size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{client.address}</span>
                </div>
              </div>
            </div>

            {/* Accordion Toggle */}
            <button 
              onClick={() => toggleExpand(client.id)}
              className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span>Histórico de OS ({client.history.length})</span>
              </div>
              {expandedId === client.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Expanded History */}
            {expandedId === client.id && (
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-4 max-h-48 overflow-y-auto">
                {client.history.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">Nenhuma OS encontrada.</p>
                ) : (
                  <div className="space-y-3">
                    {client.history.map((os, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <FileText size={14} /> OS #{os.os}
                          </span>
                          <span className="text-xs text-slate-500">{os.date}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs mb-1.5 line-clamp-1">{os.desc}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            os.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {os.status}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{os.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
