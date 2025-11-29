import { Navigate, Outlet,BrowserRouter, Routes, Route } from "react-router-dom";


import EmailVerified from "./pages/auth/EmailVerified";
import EmailVerification from "./pages/auth/EmailVerification";
import AuthPage from "./pages/auth/AuthPage";

import AuthProvider from "./context/AuthProvider";
import ChannelProvider from "./context/ChannelProvider";

import ChannelPage from "./pages/user/channel/ChannelPage";
import ChatArea from "./pages/user/channel/ChatArea";
import Members from "./pages/user/channel/Members";
import Files from "./pages/user/channel/Files";
import HomeLayout from "./pages/user/HomeLayout";
import Board from "./pages/user/channel/Board";
import { useAuth } from "./context/context";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChannelProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-gen" element={<EmailVerification />} />
            <Route path="/verify-link" element={<EmailVerified />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomeLayout />} />
              <Route path="/channel/:id" element={<ChannelPage />}>
                <Route index element={<ChatArea />} />
                <Route path="members" element={<Members />} />
                <Route path="files" element={<Files />} />
                <Route path="board" element={<Board />} />
              </Route>
            </Route>

            {/* Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChannelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ProtectedRoute() {
  const { user } = useAuth();

  // If not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated → render child routes
  return <Outlet />;
}
