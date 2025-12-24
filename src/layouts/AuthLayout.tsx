import { Outlet } from "react-router-dom";

// Layout responsável pelas páginas de autenticação (Login, Cadastro, Reset Password).
// Ele envolve essas páginas com um container estilizado e deixa o <Outlet />
// responsável por renderizar a página correspondente da rota.
export function AuthLayout() {
  return (
    <div
      className="
        auth-container w-full p-6 sm:p-10 bg-forest min-h-screen flex items-center justify-center"
    >
      {/* O <Outlet /> renderiza dinamicamente o componente da rota filha,
          como <SignIn />, <SignUp />, <ResetPassword /> */}
      <Outlet />
    </div>
  );
}
