import type { ReactNode } from "react";
import type { UserIconKey } from "./User.types"

export const USER_ICON: Record<UserIconKey, () => ReactNode> = {
  classic: () => <i className="fa-solid fa-circle-user fa-xl"></i>,
  sharp: () => <i className="fa-sharp fa-solid fa-circle-user fa-xl"></i>,
  slab: () => <i className="fa-slab-press fa-regular fa-circle-user fa-xl"></i>,
};
