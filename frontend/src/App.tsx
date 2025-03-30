import { Routes, Route, Navigate } from "react-router-dom";

import useAuthStore from "@/store/useAuthStore";
import ProtectedRoute from "@/components/protected";

import HomePage from "@/pages/home";
import SignUpPage from "@/pages/Signup/signup";
import LoginPage from "@/pages/Login";
import PaymentPage from "@/pages/Payment";
import NotFoundPage from "@/pages/404";

export default function App() {
  const { isAuthenticated } = useAuthStore((state) => state);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
