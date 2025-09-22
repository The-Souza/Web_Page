import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { TYPE_VARIANTS } from "./Type.variants";
import { DOCK_VARIANTS_DESKTOP, DOCK_VARIANTS_MOBILE } from "./Dock.variants";
import classNames from "classnames";
import type { ToastContextType } from "@/components/providers/provider.types";
import type { ToastProps, ToastState } from "./Toast.types";
import { defaultToast } from "./Toast.dafaults";
import { UseMediaQuery } from "@/hooks/UseMediaQuery";

export const Toast = forwardRef<ToastContextType, object>((_, ref) => {
  const [toastData, setToastData] = useState<ToastState>({
    ...defaultToast,
    visible: false,
  });

  const [opacity, setOpacity] = useState(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktop = UseMediaQuery("(min-width: 768px)");

  const showToast = (options: ToastProps = {}) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    const newToast: ToastState = {
      type: options.type ?? defaultToast.type,
      title: options.title ?? defaultToast.title,
      text: options.text ?? defaultToast.text,
      duration: options.duration ?? defaultToast.duration,
      dock: options.dock ?? defaultToast.dock,
      visible: true,
    };

    setToastData(newToast);
    setOpacity(1);

    hideTimeoutRef.current = setTimeout(() => hideToast(), newToast.duration * 1000);
  };

  const hideToast = () => {
    setOpacity(0);
    setTimeout(() => setToastData((prev) => ({ ...prev, visible: false })), 300);
  };

  useImperativeHandle(ref, () => ({ showToast }));

  if (!toastData.visible) return null;

  const typeVariant = TYPE_VARIANTS[toastData.type];
  const dockPosition = isDesktop
    ? DOCK_VARIANTS_DESKTOP[toastData.dock]
    : DOCK_VARIANTS_MOBILE[toastData.dock];

  const wrapperClass = classNames(
    "w-full max-w-[calc(100%-2rem)] sm:max-w-[30.8125rem] h-auto py-3 px-4 mx-auto flex gap-3 rounded transition-opacity duration-300",
    typeVariant.bgColor
  );

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
      <div className="w-5 h-6 flex justify-center items-center">
        <i className={iconClass}></i>
      </div>
      <div className="flex-1 sm:max-w-[26.8125rem] h-auto">
        <div className="flex justify-between">
          <h2 className="text-[#2D3748] font-[lato] font-extrabold text-md leading-6 tracking-normal">
            {toastData.title}
          </h2>
          <button aria-label="close" onClick={hideToast}>
            <i
              className={classNames("fa fa-times cursor-pointer", typeVariant.closeColor)}
            ></i>
          </button>
        </div>
        <p className="text-[#2D3748] font-[lato] font-bold text-sm leading-6 tracking-normal">
          {toastData.text}
        </p>
      </div>
    </div>
  );
});


Toast.displayName = "Toast";
