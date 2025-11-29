import { Routes, Route } from "react-router-dom";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ResetPassword from "@/pages/auth/ResetPassword";
import Home from "@/pages/private/Home";
import Dashboard from "@/pages/private/Dashboard";
import ResgisterAccount from "@/pages/private/RegisterAccount";
import { PrivateRoute } from "@/hooks/PrivateRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";

export function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <Routes>

        {/* ===== Rotas públicas (não precisam de autenticação) ===== */}
        <Route element={<AuthLayout />}>
          {/* Tela inicial: login */}
          <Route path="/" element={<SignIn />} />

          {/* Cadastro de novo usuário */}
          <Route path="/signup" element={<SignUp />} />

          {/* Recuperação de senha */}
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ===== Rotas privadas (somente autenticado) ===== */}
        {/* PrivateRoute protege as rotas abaixo, garantindo acesso apenas com login válido */}
        <Route element={<PrivateRoute />}>

          {/* MainLayout envolve todas as páginas internas após login */}
          <Route element={<MainLayout />}>

            {/* Página inicial privada */}
            <Route path="/home" element={<Home />} />

            {/* Dashboard do usuário */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Tela de cadastro de conta */}
            <Route path="/register-account" element={<ResgisterAccount />} />
          </Route>
        </Route>

      </Routes>
    </div>
  );
}
