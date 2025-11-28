import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import EmailVerified from "./pages/auth/EmailVerified";
import EmailVerification from "./pages/auth/EmailVerification";
import ChannelLayout from "./pages/user/ ChannelLayout";
import AuthPage from "./pages/auth/AuthPage";

// providers
import AuthProvider from "./context/AuthProvider";
import ChannelPage from "./pages/user/channel/ChannelPage";
import ChatArea from "./pages/user/channel/ChatArea";
import Members from "./pages/user/channel/Members";
import Files from "./pages/user/channel/Files";
import ChannelProvider from "./context/ChannelProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChannelProvider>
          <Routes>
            {/* <Header /> */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-gen" element={<EmailVerification />} />
            <Route path="/verify-link" element={<EmailVerified />} />

            <Route path="/home" element={<ChannelLayout />} />
            <Route path="/channel/:id" element={<ChannelPage />}>
              <Route index element={<ChatArea />} />
              <Route path="members" element={<Members />} />

              <Route path="files" element={<Files />} />
            </Route>
          </Routes>
        </ChannelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
