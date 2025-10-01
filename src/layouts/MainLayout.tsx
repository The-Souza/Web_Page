import { Header, UserIcon, Button } from "@/components";
import { useAuth } from "@/hooks/UseAuth";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import classNames from "classnames";
import { useMediaQuery } from "@/hooks/UseMediaQuery";

export function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/home": "Home",
    "/dashboard": "Dashboard",
    "/register-account": "Register Account",
  };

  const headerText = pageTitles[location.pathname] || "Página";

  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <div
      className="main-layout w-full min-h-screen flex flex-col bg-[url('@/assets/img/bg_private2.jpg')]
      bg-cover bg-right sm:bg-center bg-no-repeat"
    >
      <Header
        text={headerText}
        userName={user?.name}
        onClick={handleLogout}
        menuOpen={menuOpen}
        onMenuToggle={setMenuOpen}
      />

      <div className="flex flex-1 w-full mt-[80px] sm:mt-[86px] relative">
        {menuOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <div
          className={classNames(
            "bg-dark text-greenLight flex flex-col items-start gap-4 p-4 shadow-2xl shadow-greenLight border-2",
            "border-greenLight transition-transform duration-300 z-50 w-56 sm:w-64",
            {
              "fixed top-[80px] sm:top-[86px] left-0 h-full": true,
              "-translate-x-full": !menuOpen,
              "translate-x-0": menuOpen,
            }
          )}
        >
          {isMobile && (
            <div className="flex flex-col items-center gap-3">
              <UserIcon userName={user?.name || ""} icon="classic" />
              <Button
                variant="bottomless"
                icon="logout"
                text="Logout"
                size="auto"
                onClick={handleLogout}
              />
            </div>
          )}

          {isMobile && <div className="w-full h-[1.5px] bg-greenLight"></div>}

          <div className="flex flex-col items-start gap-1">
            <Button
              variant="bottomless"
              text="Home"
              onClick={() => navigate("/home")}
            />
            <Button
              variant="bottomless"
              text="Register Account"
              onClick={() => navigate("/register-account")}
            />
            <Button
              variant="bottomless"
              text="Dashboard"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>

        <main
          className={classNames("flex-1 transition-all duration-300 p-4 sm:p-8", {
            "ml-56 sm:ml-64": menuOpen && !isMobile,
          })}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
