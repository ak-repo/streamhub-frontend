import {
  Navigate,
  Outlet,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
import Profile from "./pages/user/Profile";

import Dashboard from "./pages/admin/Dashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ChannelsManagement from "./pages/admin/ChannelsManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import Home from "./pages/user/Home";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChannelProvider>
          <Toaster position="bottom-right" />
          <UserRoutes />
          <AdminR />
        </ChannelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

/* -----------------------------
   USER PROTECTED ROUTE
------------------------------ */
function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function UserRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/verify-gen" element={<EmailVerification />} />
      <Route path="/verify-link" element={<EmailVerified />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
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
    </Routes>
  );
}

function AdminR() {
  return (
    <Routes>
      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route element={<AdminLayout />}>
          {/* Default Redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="channels" element={<ChannelsManagement />} />
          <Route path="files" />
        </Route>
      </Route>
    </Routes>
  );
}

/* -----------------------------
   ADMIN PROTECTED ROUTE
------------------------------ */
function AdminRoutes() {
  const { user } = useAuth();

  // User not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User logged in but not admin
  if (user.role !== "super-admin") {
    return <Navigate to="/home" replace />;
  }

  // User is admin
  return <Outlet />;
}
