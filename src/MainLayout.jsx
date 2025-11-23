import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import AuthPage from "./pages/user/auth/AuthPage";
import BottomNavigation from "./components/Navbar";
// Dashboard Pages
import FilesPage from "./pages/user/FilesPage";
import ChatPage from "./pages/user/ChatPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import ProfilePage from "./pages/user/ProfilePage";
import NotFoundPage from "./pages/404";
import EmailVerification from "./pages/user/auth/EmailVerification";
import EmailVerified from "./pages/user/auth/EmailVerified";

// Layout wrapper for pages with BottomNavigation
function DashboardLayout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
}

export default function MainLayout() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/verify" element={<EmailVerification />} />
      <Route path="/verify-link" element={<EmailVerified />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Dashboard Routes with BottomNavigation */}
      <Route element={<DashboardLayout />}>
        <Route path="files" element={<FilesPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Default redirect example */}
      <Route path="/hub" element={<Navigate to="/files" replace />} />
    </Routes>
  );
}
