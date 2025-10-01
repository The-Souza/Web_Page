import type { ReactNode } from "react";
import type { UserIconKey } from "./UserIcon.types"

export const USER_ICON: Record<UserIconKey, () => ReactNode> = {
  classic: () => <i className="fa-solid fa-circle-user fa-2xl"></i>,
  slab: () => <i className="fa-slab-press fa-regular fa-circle-user fa-2xl"></i>,
  admin: () => <i className="fa-solid fa-user-shield fa-2xl text-current"></i>,
  guest: () => <i className="fa-solid fa-user-astronaut fa-2xl text-current"></i>,
};
