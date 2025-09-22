import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="main-layout">
      <header>Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
}
