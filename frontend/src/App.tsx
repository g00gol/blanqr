import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home";
import SignUpPage from "./pages/Signup/signup";
import LoginPage from "./pages/Login";
import PaymentPage from "./pages/payment";
import NotFoundPage from "./pages/404";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
