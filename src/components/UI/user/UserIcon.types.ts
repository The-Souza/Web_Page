export type UserIconKey = "classic" | "slab" | "admin" | "guest";

export interface UserIconProps {
  userName?: string;
  icon: UserIconKey;
}