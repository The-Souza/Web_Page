import { Header, UserIcon, Button } from "@/components";
import { useAuth } from "@/hooks/UseAuth";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { useMediaQuery } from "@/hooks/UseMediaQuery";
import { useLoading } from "@/components/providers/hook/useLoading";

export function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { setLoading, reset } = useLoading();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true, "Logging out...");
    try {
      await logout();
      setMenuOpen(false);
      reset();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadingMessages: Record<string, string> = {
    "/home": "Loading homepage...",
    "/register-account": "Loading account registration form...",
    "/dashboard": "Loading dashboard...",
  };

  const handleNavigation = async (path: string) => {
    const message = loadingMessages[path] || "Loading...";
    setLoading(true, message);

    try {
      setMenuOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate(path);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const location = useLocation();

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [location.pathname, setLoading]);

  const pageTitles: Record<string, string> = {
    "/home": "Home",
    "/dashboard": "Dashboard",
    "/register-account": "Register Account",
  };

  const headerText = pageTitles[location.pathname] || "Page";

  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <div
      className="main-layout w-full min-h-screen flex flex-col bg-forest
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
            "bg-dark text-greenLight flex flex-col items-start gap-4 p-4 border-r-2 border-t-2",
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
              onClick={() => handleNavigation("/home")}
            />
            <Button
              variant="bottomless"
              text="Register Account"
              onClick={() => handleNavigation("/register-account")}
            />
            <Button
              variant="bottomless"
              text="Dashboard"
              onClick={() => handleNavigation("/dashboard")}
            />
          </div>
        </div>

        <main
          className={classNames(
            "flex-1 transition-all duration-300 p-4 sm:p-8",
            {
              "ml-56 sm:ml-64": menuOpen && !isMobile,
            }
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
