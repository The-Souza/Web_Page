import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/hook/useAuth";

/**
 * 🔹 PrivateRoute
 * Componente responsável por proteger rotas que exigem autenticação.
 *
 * - Se o usuário estiver autenticado, renderiza os componentes filhos via <Outlet />.
 * - Se não estiver autenticado, redireciona para a página inicial "/" usando <Navigate />.
 *
 * Exemplo de uso:
 * <Route element={<PrivateRoute />}>
 *   <Route path="/home" element={<Home />} />
 * </Route>
 */
export function PrivateRoute() {
  // 🔹 Obtém estado de autenticação do usuário
  const { isAuthenticated } = useAuth();

  // 🔹 Se autenticado, renderiza a rota filha
  // 🔹 Caso contrário, redireciona para "/" substituindo histórico (replace)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
