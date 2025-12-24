import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PrivateRoute } from "@/hooks/PrivateRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { LoadingFallback } from "@/hooks/loadingFallback";

const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Home = lazy(() => import("@/pages/private/Home"));
const RegisterAccount = lazy(() => import("@/pages/private/RegisterAccount"));

export function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <Suspense fallback={<LoadingFallback />}>
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

              {/* Tela de cadastro de conta */}
              <Route path="/register-account" element={<RegisterAccount />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}
