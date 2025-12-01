// Posicionamento possível do toast na tela
export type ToastDock =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

// Define as propriedades de estilo para posicionamento absoluto do toast
export interface DockProps {
  top?: string;       // Distância do topo
  bottom?: string;    // Distância da base
  left?: string;      // Distância da esquerda
  right?: string;     // Distância da direita
  transform?: string; // Transformações CSS, útil para centralização
}

// Tipos de toast suportados
export type ToastType = "info" | "alert" | "news" | "success" | "error";

// Props configuráveis de um toast
export interface ToastProps {
  title?: string;       // Título do toast
  text?: string;        // Texto detalhado do toast
  type?: ToastType;     // Tipo do toast, influencia cor e ícone
  dock?: ToastDock;     // Posição na tela
  duration?: number;    // Tempo em segundos antes do toast desaparecer
  onClose?: () => void; // Callback quando o toast fecha
}

// Configuração visual de cada tipo de toast
export interface TypeProps {
  icon: string;       // Ícone a ser exibido
  iconColor: string;  // Cor do ícone
  bgColor: string;    // Cor de fundo do toast
  closeColor: string; // Cor do botão de fechar
}

// Estado interno do toast (sempre visível ou não)
export type ToastState = Required<Omit<ToastProps, "onClose">> & {
  visible: boolean;   // Controle de visibilidade
};
