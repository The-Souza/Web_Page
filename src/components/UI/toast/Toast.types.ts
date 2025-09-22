export type ToastDock =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface DockProps {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}

export type ToastType = "info" | "alert" | "news" | "success" | "error";

export interface ToastProps {
  title?: string;
  text?: string;
  type?: ToastType;
  dock?: ToastDock;
  duration?: number;
  onClose?: () => void;
}

export interface TypeProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  closeColor: string;
}

export type ToastState = Required<Omit<ToastProps, "onClose">> & {
  visible: boolean;
};
