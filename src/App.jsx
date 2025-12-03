import {
  Navigate,
  Outlet,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthProvider from "./context/AuthProvider";
import ChannelProvider from "./context/ChannelProvider";
import { useAuth } from "./context/context";

/* --- Auth Pages --- */
import AuthPage from "./pages/auth/AuthPage";
import EmailVerification from "./pages/auth/EmailVerification";
import EmailVerified from "./pages/auth/EmailVerified";

/* --- User Pages --- */
import HomeLayout from "./pages/user/HomeLayout";
import Home from "./pages/user/Home";
import Profile from "./pages/user/Profile";
import ChannelPage from "./pages/user/channel/ChannelPage";
import ChatArea from "./pages/user/channel/ChatArea";
import Members from "./pages/user/channel/Members";
import Files from "./pages/user/channel/Files";
import Board from "./pages/user/channel/Board";

/* --- Admin Pages --- */
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ChannelsManagement from "./pages/admin/ChannelsManagement";
import FilesManagement from "./pages/admin/FilesManagement";
import AdminProfile from "./pages/admin/AdminProfile";

/* ----------------------------------
   PROTECTED ROUTES
---------------------------------- */
function UserProtected() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

function AdminProtected() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "super-admin") return <Navigate to="/home" replace />;

  return <Outlet />;
}

/* ----------------------------------
   MAIN APP
---------------------------------- */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChannelProvider>
          <Toaster position="bottom-right" />

          <Routes>
            {/* -------------------------
                PUBLIC ROUTES
            -------------------------- */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/verify-gen" element={<EmailVerification />} />
            <Route path="/verify-link" element={<EmailVerified />} />

            {/* -------------------------
                USER ROUTES
            -------------------------- */}
            <Route element={<UserProtected />}>
              <Route path="/home" element={<HomeLayout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route path="/channel/:id" element={<ChannelPage />}>
                <Route index element={<ChatArea />} />
                <Route path="members" element={<Members />} />
                <Route path="files" element={<Files />} />
                <Route path="board" element={<Board />} />
              </Route>
            </Route>

            {/* -------------------------
                ADMIN ROUTES
            -------------------------- */}
            <Route path="/admin" element={<AdminProtected />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="channels" element={<ChannelsManagement />} />
                <Route path="files" element={<FilesManagement />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>
          </Routes>
        </ChannelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
