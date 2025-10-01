import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="auth-container w-full p-6 sm:p-10 bg-[url('@/assets/img/bg_auth.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
