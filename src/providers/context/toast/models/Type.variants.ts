import type { ToastType, TypeProps } from "./Toast.types";

// Define as configurações visuais de cada tipo de toast
export const TYPE_VARIANTS: Record<ToastType, TypeProps> = {
  info: {
    icon: "fa-info-circle",           // Ícone para toast do tipo "info"
    iconColor: "text-[#0F7FD1]",      // Cor do ícone
    bgColor: "bg-[#D4EDFF]",          // Cor de fundo
    closeColor: "text-[#113F63]",     // Cor do botão de fechar
  },
  alert: {
    icon: "fa-exclamation-circle",
    iconColor: "text-[#FFB200]",
    bgColor: "bg-[#F7F6D2]",
    closeColor: "text-[#CC8500]",
  },
  news: {
    icon: "fa-bullhorn",
    iconColor: "text-[#6646B9]",
    bgColor: "bg-[#E5DBFF]",
    closeColor: "text-[#6646B9]",
  },
  success: {
    icon: "fa-check-circle",
    iconColor: "text-[#00B887]",
    bgColor: "bg-[#D0F2E1]",
    closeColor: "text-[#007061]",
  },
  error: {
    icon: "fa-exclamation-circle",
    iconColor: "text-[#E34444]",
    bgColor: "bg-[#FFE5E5]",
    closeColor: "text-[#A81919]",
  },
};
