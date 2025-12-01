import { Header, UserIcon, Button } from "@/components";
import { useAuth } from "@/providers/hook/useAuth";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLoading } from "@/providers/hook/useLoading";
import { ROUTE_MESSAGES } from "@/types/routeMessages.variants";
import { pageTitles } from "@/types/PageTitles.variants";

/**
 * MainLayout
 * ------------------------------------------------------------
 * Layout principal da aplicação.
 * - Gerencia o menu lateral, navegação entre páginas e logout.
 * - Exibe o header com o nome do usuário e título da página.
 * - Responsivo: comportamento diferente para mobile e desktop.
 */
export function MainLayout() {
  // Hooks de contexto
  const { logout, user } = useAuth(); // hook de autenticação
  const navigate = useNavigate(); // navegação do React Router
  const { setLoading } = useLoading(); // hook para controle de loading global

  // Estado do menu lateral (aberto/fechado)
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * handleLogout
   * ------------------------------------------------------------
   * Realiza o logout do usuário:
   * - Mostra loader "Logging out..."
   * - Espera 2s para efeito visual
   * - Chama função logout do AuthContext
   * - Fecha menu lateral e redireciona para página inicial
   */
  const handleLogout = async () => {
    setLoading(true, "Logging out...");

    try {
      await new Promise((res) => setTimeout(res, 2000)); // delay visual
      logout(); // logout síncrono do contexto
      setMenuOpen(false); // fecha menu
      navigate("/"); // sai das rotas pivadas
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleNavigation
   * ------------------------------------------------------------
   * Controla a navegação entre páginas:
   * - Mostra loader com mensagem apropriada
   * - Fecha menu lateral
   * - Redireciona para a rota
   */
  const handleNavigation = async (path: string) => {
  const message = ROUTE_MESSAGES[path] || "Loading...";
  setLoading(true, message); // passa a mensagem correta

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


  // Obtenção da rota atual para atualizar título e efeitos
  const location = useLocation();

  /**
   * useEffect para garantir que o loading seja desativado
   * ao trocar de rota, evitando loader preso.
   */
  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [location.pathname, setLoading]);

  const headerText = pageTitles[location.pathname] || "Page"; // título padrão

  // Detecta se o dispositivo é mobile (para abrir/fechar menu)
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <div
      className="main-layout w-full min-h-screen flex flex-col bg-forest
      bg-cover bg-right sm:bg-center bg-no-repeat"
    >
      {/* Header */}
      <Header
        text={headerText} // título da página
        userName={user?.name} // nome do usuário
        onClick={handleLogout} // botão de logout
        menuOpen={menuOpen} // estado do menu
        onMenuToggle={setMenuOpen} // toggle do menu
      />

      <div className="flex flex-1 w-full mt-[80px] sm:mt-[86px] relative">
        {/* Overlay para mobile quando menu está aberto */}
        {menuOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Menu lateral */}
        <div
          className={classNames(
            "bg-dark text-greenLight flex flex-col items-start gap-4 p-4 border-r-2 border-t-2",
            "border-greenLight transition-transform duration-300 z-50 w-56 sm:w-64",
            {
              "fixed top-[80px] sm:top-[86px] left-0 h-full": true, // posição fixa
              "-translate-x-full": !menuOpen, // escondido
              "translate-x-0": menuOpen, // visível
            }
          )}
        >
          {/* Se mobile, mostra avatar e botão de logout no menu */}
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

          {/* Linha divisória no mobile */}
          {isMobile && <div className="w-full h-[1.5px] bg-greenLight"></div>}

          {/* Botões de navegação */}
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

        {/* Conteúdo principal */}
        <main
          className={classNames(
            "flex-1 transition-all duration-300 p-4 sm:p-8",
            {
              "ml-56 sm:ml-64": menuOpen && !isMobile, // desloca conteúdo se menu desktop aberto
            }
          )}
        >
          <Outlet /> {/* Renderiza o conteúdo da rota atual */}
        </main>
      </div>
    </div>
  );
}
