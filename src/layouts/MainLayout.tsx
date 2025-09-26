import { Header } from "@/components";
import { useAuth } from "@/hooks/UseAuth";
import { Outlet, useNavigate } from "react-router-dom";

export function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="main-layout w-full flex flex-col bg-[url('@/assets/img/bg_private2.jpg')] bg-cover bg-center bg-no-repeat min-h-screen items-center justify-center">
      <Header text="Home" userName={user?.name} onClick={handleLogout}></Header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}
