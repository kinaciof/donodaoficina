import { 
  FileText, 
  Search, 
  Wrench, 
  PauseCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Car, 
  ClipboardCheck, 
  Banknote,
  AlertCircle
} from "lucide-react";

export type OSStatusType = 
  | "pre_cadastrada"
  | "aguardando_inspecao"
  | "em_orcamento"
  | "aguardando_aprovacao"
  | "em_servico"
  | "aguardando_pecas"
  | "servico_concluido"
  | "pronto_para_retirada"
  | "entregue_pago"
  | "nao_autorizada"
  | "garantia_retorno";

export interface OSStatusConfig {
  id: OSStatusType;
  label: string;
  icon: any; // LucideIcon
  colorClass: string;
  bgColorClass: string;
}

export const OS_STATUSES: Record<OSStatusType, OSStatusConfig> = {
  pre_cadastrada: {
    id: "pre_cadastrada",
    label: "Pré-cadastrada",
    icon: FileText,
    colorClass: "text-slate-500",
    bgColorClass: "bg-slate-100 dark:bg-slate-800",
  },
  aguardando_inspecao: {
    id: "aguardando_inspecao",
    label: "Aguardando Inspeção",
    icon: Search,
    colorClass: "text-blue-500",
    bgColorClass: "bg-blue-100 dark:bg-blue-900/30",
  },
  em_orcamento: {
    id: "em_orcamento",
    label: "Em Orçamento",
    icon: ClipboardCheck,
    colorClass: "text-indigo-500",
    bgColorClass: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  aguardando_aprovacao: {
    id: "aguardando_aprovacao",
    label: "Aguardando Aprovação",
    icon: Clock,
    colorClass: "text-amber-500",
    bgColorClass: "bg-amber-100 dark:bg-amber-900/30",
  },
  em_servico: {
    id: "em_servico",
    label: "Em Serviço",
    icon: Wrench,
    colorClass: "text-primary",
    bgColorClass: "bg-primary/10",
  },
  aguardando_pecas: {
    id: "aguardando_pecas",
    label: "Aguardando Peças",
    icon: PauseCircle,
    colorClass: "text-orange-500",
    bgColorClass: "bg-orange-100 dark:bg-orange-900/30",
  },
  servico_concluido: {
    id: "servico_concluido",
    label: "Serviço Concluído",
    icon: CheckCircle2,
    colorClass: "text-green-500",
    bgColorClass: "bg-green-100 dark:bg-green-900/30",
  },
  pronto_para_retirada: {
    id: "pronto_para_retirada",
    label: "Pronto para Retirada",
    icon: Car,
    colorClass: "text-emerald-500",
    bgColorClass: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  entregue_pago: {
    id: "entregue_pago",
    label: "Entregue e Pago",
    icon: Banknote,
    colorClass: "text-teal-600",
    bgColorClass: "bg-teal-100 dark:bg-teal-900/30",
  },
  nao_autorizada: {
    id: "nao_autorizada",
    label: "Não Autorizada",
    icon: XCircle,
    colorClass: "text-red-500",
    bgColorClass: "bg-red-100 dark:bg-red-900/30",
  },
  garantia_retorno: {
    id: "garantia_retorno",
    label: "Garantia / Retorno",
    icon: AlertCircle,
    colorClass: "text-rose-500",
    bgColorClass: "bg-rose-100 dark:bg-rose-900/30",
  }
};

export interface OrdemServico {
  id: string;
  tenant_id: string;
  cliente_id: string;
  veiculo_id: string;
  placa: string;
  status: OSStatusType;
  descricao_problema: string;
  valor_total?: number;
  data_entrada: Date;
  data_previsao_entrega?: Date;
  fotos?: string[]; // Firebase Storage URLs
}