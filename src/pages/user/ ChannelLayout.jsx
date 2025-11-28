import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/context";
import {
  createChannel,
  joinChannel,
  listChannels,
} from "../../api/services/channelService";
import { useNavigate } from "react-router-dom";

function ChannelLayout() {
  const [channels, setChannel] = useState([]);
  const { user } = useAuth();
  const [inputID, setInputID] = useState("");
  const [inputName, setInputName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const listAll = async () => {
      try {
        const data = await listChannels(user.id);
        setChannel(data?.channels || []);
      } catch (err) {
        alert("Failed to list channels");
      }
    };

    listAll();
  }, [user?.id]);

  const handleCreate = async () => {
    if (!user?.id) return;
    if (!inputName.trim()) return alert("Enter channel name");

    try {
      await createChannel(inputName, user.id);
      const data = await listChannels(user.id);
      setChannel(data?.channels || []);
      setInputName("");
    } catch (err) {
      alert("Failed to create channel");
    }
  };

  const handleJoin = async () => {
    if (!inputID.trim()) return alert("Enter channel ID");
    if (!user?.id) return;

    try {
      await joinChannel(inputID, user.id);
      setInputID("");
    } catch (err) {
      alert("Failed to join channel");
    }
  };

  return (
    <div>
      <Header />

      <h1 className="text-black text-xl font-semibold mb-4">My Channels</h1>

      {/* Channel List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {channels.length > 0 ? (
          channels.map((ch) => (
            <div
              key={ch.channel_id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
            >
              <h2 className="text-lg font-medium">{ch.name}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {ch.channel_id}</p>
              <p>Members: {ch.members.length}</p>
              <button onClick={() => navigate(`/channel/${ch.channel_id}`)}>
                View
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No channels found.</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 p-4 border-t">
        <h2 className="text-lg font-semibold mb-3">Channel Actions</h2>

        {/* Create Section */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="New channel name"
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
          >
            Create
          </button>
        </div>

        {/* Join Section */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputID}
            onChange={(e) => setInputID(e.target.value)}
            placeholder="Channel ID to join"
            className="border px-3 py-2 rounded w-64"
          />
          <button
            onClick={handleJoin}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChannelLayout;
