export interface HeaderProps {
  text: string;
  userName?: string;
  onClick?: () => void;
  menuOpen?: boolean;
  onMenuToggle?: (open: boolean) => void;
} 