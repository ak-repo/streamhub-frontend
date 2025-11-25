import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import ChatRoom from "./pages/user/ChatRoom";
import Profile from "./pages/user/Profile";
import Notification from "./pages/user/Notification";
import Settings from "./pages/user/Settings";
import AuthProvider from "./context/AuthProvider";
import ActionProvider from "./context/ActionProvider";
import AuthPage from "./pages/user/auth/AuthPage";
import EmailVerified from "./pages/user/auth/EmailVerified";
import EmailVerification from "./pages/user/auth/EmailVerification";
import UploadsPage from "./pages/user/UploadsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActionProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-gen" element={<EmailVerification />} />
            <Route path="/verify-link" element={<EmailVerified />} />

            {/* Main Layout ALWAYS mounted */}
            <Route element={<MainLayout />}>
              <Route path="/hub" element={<ChatRoom />} />
              <Route path="/hub/profile" element={<Profile />} />
              <Route path="/hub/notifications" element={<Notification />} />
              <Route path="/hub/settings" element={<Settings />} />
              <Route path="/hub/uploads" element={<UploadsPage />} />
            </Route>
          </Routes>
        </ActionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
