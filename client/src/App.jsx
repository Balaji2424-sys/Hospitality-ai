import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useApp } from "./context/AppContext.jsx";
import LanguageSelectionPage from "./pages/LanguageSelectionPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DiagnosisPage from "./pages/DiagnosisPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import DoctorDashboardPage from "./pages/DoctorDashboardPage.jsx";
import DoctorAnalyticsPage from "./pages/DoctorAnalyticsPage.jsx";

function AppHome() {
  const { auth } = useApp();

  if (auth.user?.role === "doctor") {
    return <Navigate to="/app/doctor/dashboard" replace />;
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LanguageSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AppHome />} />
        <Route path="diagnosis" element={<DiagnosisPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route
          path="doctor/dashboard"
          element={
            <ProtectedRoute roles={["doctor"]}>
              <DoctorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="doctor/analytics"
          element={
            <ProtectedRoute roles={["doctor"]}>
              <DoctorAnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
