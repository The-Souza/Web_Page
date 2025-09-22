import { Routes, Route } from "react-router-dom";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ResetPassword from "@/pages/auth/ResetPassword";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";

export function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <Routes>
        {/* Rotas de autenticação */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {/* Aqui entram as rotas protegidas */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
