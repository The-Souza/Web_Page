import type { HeaderProps } from "./Header.types";
import classNames from "classnames";
import { Title, Button, UserIcon } from "@/components/index";
import { useMediaQuery } from "@/hooks/UseMediaQuery";

export function Header({
  text = "Header Title",
  userName = "",
  onClick,
  menuOpen = false,
  onMenuToggle,
}: HeaderProps) {
  const isMobile = useMediaQuery("(max-width: 639px)");

  const toggleMenu = () => {
    onMenuToggle?.(!menuOpen)
  };

  const headerClass = classNames(
    "fixed top-0 left-0 flex w-full h-auto justify-between items-center py-5 px-5 sm:px-10 z-50",
    "bg-dark border-b-2 border-b-greenLight"
  );

  return (
      <header className={headerClass}>
        <div className="flex gap-4 sm:gap-4 items-center justify-center">
          <button
            className="cursor-pointer"
            onClick={toggleMenu}
          >
            <i className="fa-solid fa-bars text-greenLight fa-2xl"></i>
          </button>
          <img src="/icon.png" alt="Logo" className="w-10 h-10" />
          <Title text={text} size="3xl" />
        </div>

        {!isMobile && (
          <div className="flex items-center gap-3">
            <UserIcon userName={userName} icon="classic" />
            <Button
              variant="border"
              icon="logout"
              text="Logout"
              size="auto"
              onClick={onClick}
            />
          </div>
        )}
      </header>
  );
}
