import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useChannel } from "../../../context/context";
import { useEffect } from "react";

export default function ChannelPage() {
  const { id } = useParams();
  const { setChanID, channel } = useChannel();
  const navigate = useNavigate();

  useEffect(() => {
    setChanID(id);
  }, [id]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 border-r bg-white flex flex-col">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="m-3 mb-4 px-3 py-2 border rounded hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        {/* Channel Name */}
        <h2 className="text-lg font-semibold px-4 mb-4">
          {channel?.name ? channel.name : "Loading..."}
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1 px-3">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Chat
          </NavLink>

          <NavLink
            to="members"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Members
          </NavLink>

          <NavLink
            to="files"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Files
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
