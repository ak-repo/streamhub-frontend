import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./context/context";
import { useEffect } from "react";

export default function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header - Fixed at top, full width */}
      <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Header />
      </header>

      {/* Main Content Area - Takes remaining height */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar - Fixed width, scrollable chat list */}
        <aside className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </aside>

        {/* Main Chat Area - Flexible width */}
        <main className="flex-1 min-w-0 bg-white dark:bg-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
