import { ToggleTheme } from "@/components";
import { Outlet } from "react-router-dom";

// Layout responsável pelas páginas de autenticação (Login, Cadastro, Reset Password).
// Ele envolve essas páginas com um container estilizado e deixa o <Outlet />
// responsável por renderizar a página correspondente da rota.
export function AuthLayout() {
  return (
    <div
      className="
        auth-container flex flex-col w-full p-6 sm:p-10 bg-background min-h-screen items-center justify-center"
    >
      <div className="absolute top-6 right-6">
        <ToggleTheme />
      </div>

      {/* O <Outlet /> renderiza dinamicamente o componente da rota filha, como <SignIn />, <SignUp />, <ResetPassword /> */}
      <Outlet />
    </div>
  );
}
