import type { ToastType, TypeProps } from "./Toast.types";

export const TYPE_VARIANTS: Record<ToastType, TypeProps> = {
  info: {
    icon: "fa-info-circle",
    iconColor: "text-[#0F7FD1]",
    bgColor: "bg-[#D4EDFF]",
    closeColor: "text-[#113F63]",
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
