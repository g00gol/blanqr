import { Routes, Route, Navigate } from "react-router-dom";

import useAuthStore from "@/store/useAuthStore";
import ProtectedRoute from "@/components/protected";

import HomePage from "@/pages/home";
import DashboardPage from "./pages/Dashboard";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import StripeLinkedPage from "./pages/Dashboard/StripeLinked";
import SignUpPage from "@/pages/Signup/signup";
import LoginPage from "@/pages/Login";
import PaymentPage from "@/pages/Payment";
import NotFoundPage from "@/pages/404";

export default function App() {
  const { isAuthenticated } = useAuthStore((state) => state);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="stripe-linked" element={<StripeLinkedPage />} />
      </Route>
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
