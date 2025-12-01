import type { ReactNode } from "react";
import type { UserIconKey } from "./UserIcon.types"

/**
 * USER_ICON
 * ------------------------------------------------------------
 * Mapeamento de chaves de ícone para funções que retornam JSX.
 * Cada chave do tipo UserIconKey corresponde a um ícone de usuário específico.
 *
 * Uso:
 * - Permite renderizar ícones dinamicamente de acordo com a prop `icon` do componente UserIcon.
 * - Retorna um ReactNode com classes de ícone do FontAwesome.
 *
 * Chaves e ícones:
 * - "classic": ícone de usuário padrão (fa-circle-user).
 * - "slab": ícone estilizado (fa-circle-user com estilo slab).
 * - "admin": ícone de administrador (fa-user-shield).
 * - "guest": ícone de convidado/astronauta (fa-user-astronaut).
 */
export const USER_ICON: Record<UserIconKey, () => ReactNode> = {
  classic: () => <i className="fa-solid fa-circle-user fa-2xl"></i>,
  slab: () => <i className="fa-slab-press fa-regular fa-circle-user fa-2xl"></i>,
  admin: () => <i className="fa-solid fa-user-shield fa-2xl text-current"></i>,
  guest: () => <i className="fa-solid fa-user-astronaut fa-2xl text-current"></i>,
};
