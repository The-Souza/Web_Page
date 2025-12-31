import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import classNames from "classnames";
import { TYPE_VARIANTS } from "./models/Type.variants";
import {
  DOCK_VARIANTS_DESKTOP,
  DOCK_VARIANTS_MOBILE,
} from "./models/Dock.variants";
import type { ToastContextType } from "@/providers/provider.types";
import type { ToastProps, ToastState } from "./models/Toast.types";
import { defaultToast } from "./models/Toast.dafaults";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Toast
 * ------------------------------------------------------------
 * Componente de notificação flutuante (toast) com suporte a:
 * - Tipos de toast (success, error, info, etc.)
 * - Posição responsiva (desktop/mobile)
 * - Auto-hide com duração configurável
 * - Controle via ref (showToast / hideToast)
 */
export const Toast = forwardRef<ToastContextType, object>((_, ref) => {
  const [toastData, setToastData] = useState<ToastState>({
    ...defaultToast,
    visible: false, // inicialmente invisível
  });

  const [opacity, setOpacity] = useState(0); // animação de fade
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ref para controle de timeout
  const isDesktop = useMediaQuery("(min-width: 768px)"); // detecta dispositivo

  // 🔹 Exibe o toast com as opções fornecidas
  const showToast = (options: ToastProps = {}) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); // cancela toast anterior

    setToastData({
      type: options.type ?? defaultToast.type,
      title: options.title ?? defaultToast.title,
      text: options.text ?? defaultToast.text,
      duration: options.duration ?? defaultToast.duration,
      dock: options.dock ?? defaultToast.dock,
      visible: true,
    });
    setOpacity(1);

    // auto-hide após duração
    hideTimeoutRef.current = setTimeout(
      () => hideToast(),
      options.duration ? options.duration * 1000 : defaultToast.duration * 1000
    );
  };

  // 🔹 Esconde o toast com animação de fade
  const hideToast = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setOpacity(0);
    setTimeout(
      () => setToastData((prev) => ({ ...prev, visible: false })),
      300 // delay para permitir animação de fade
    );
  };

  // 🔹 Exposição de métodos via ref
  useImperativeHandle(ref, () => ({ showToast, hideToast }));

  if (!toastData.visible) return null; // não renderiza se invisível

  // 🔹 Variantes de tipo e posição
  const typeVariant = TYPE_VARIANTS[toastData.type];
  const dockPosition = isDesktop
    ? DOCK_VARIANTS_DESKTOP[toastData.dock]
    : DOCK_VARIANTS_MOBILE[toastData.dock];

  // 🔹 Classes do wrapper principal
  const wrapperClass = classNames(
    "w-full max-w-[calc(100%-2rem)] sm:max-w-[30.8125rem] h-auto py-3 px-4 mx-auto flex gap-3 rounded-lg transition-opacity duration-300",
    typeVariant.bgColor
  );

  // 🔹 Classe do ícone
  const iconClass = classNames(
    "fa-solid fa-lg",
    typeVariant.icon,
    typeVariant.iconColor
  );

  return (
    <div
      className={wrapperClass}
      style={{ ...dockPosition, position: "fixed", zIndex: 9999, opacity }}
    >
      {/* Ícone do toast */}
      <div className="w-5 h-6 flex justify-center items-center">
        <i className={iconClass}></i>
      </div>

      {/* Conteúdo do toast */}
      <div className="flex-1 sm:max-w-[26.8125rem] h-auto">
        <h2 className="text-[#2D3748] font-lato font-extrabold text-md leading-6 tracking-normal">
          {toastData.title}
        </h2>

        {/* Texto */}
        <div className="text-[#2D3748] font-lato font-bold text-sm leading-6 tracking-normal whitespace-pre-line">
          {toastData.text}
        </div>
      </div>
    </div>
  );
});

Toast.displayName = "Toast";
