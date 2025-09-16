import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RememberPassword from "./pages/RememberPassword";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/remember-password" element={<RememberPassword />} />
      </Routes>
    </div>
  );
}
