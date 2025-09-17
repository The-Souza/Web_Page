import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/remember-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}
