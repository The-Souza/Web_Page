/**
 * UserIconKey
 * ------------------------------------------------------------
 * Define as chaves válidas para os ícones de usuário.
 * Cada chave corresponde a um ícone definido em USER_ICON.
 */
export type UserIconKey = "classic" | "slab" | "admin" | "guest";

/**
 * UserIconProps
 * ------------------------------------------------------------
 * Interface de propriedades do componente UserIcon.
 *
 * Propriedades:
 * - userName?: string → nome do usuário a ser exibido.
 * - icon: UserIconKey → tipo de ícone a ser mostrado.
 */
export interface UserIconProps {
  userName?: string;
  icon: UserIconKey;
}
