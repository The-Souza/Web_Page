import type { ReactNode } from "react";
import type { ButtonIconKey } from "./Button.types";

export const BUTTON_ICONS: Record<ButtonIconKey, () => ReactNode> = {
  logout: () => <i className="fa-solid fa-arrow-right-from-bracket fa-md text-current"></i>,
  email: () => <i className="fa-solid fa-envelope fa-md text-current"></i>,
  settings: () => <i className="fa-solid fa-gear fa-md text-current"></i>,
};