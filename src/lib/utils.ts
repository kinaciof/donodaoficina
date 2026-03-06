export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const generateWhatsAppLink = (
  phone: string, 
  clienteName: string, 
  osId: string, 
  status: string, 
  valor?: number
) => {
  // Limpa o telefone deixando apenas números
  const cleanPhone = phone.replace(/\D/g, "");
  
  let text = `Olá ${clienteName}! 🚗\n\nAqui é da Oficina. Sua Ordem de Serviço (OS: #${osId}) está com o status: *${status}*.`;
  
  if (valor) {
    text += `\nO valor total está em ${formatCurrency(valor)}.`;
  }
  
  text += `\n\nVocê pode acompanhar pelo nosso portal. Qualquer dúvida estamos à disposição!`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/55${cleanPhone}?text=${encodedText}`;
};

export const triggerPrint = () => {
  if (typeof window !== "undefined") {
    window.print();
  }
};
