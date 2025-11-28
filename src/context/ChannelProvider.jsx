import React, { useEffect, useState } from "react";
import { ChannelContext } from "./context";
import {
  getChannel,
  getMembers,
  getMsgHistory,
} from "../api/services/channelService";

function ChannelProvider({ children }) {
  const [channel, setChannel] = useState(null); // channel = {}
  const [members, setMembers] = useState([]); // list of members
  const [messages, setMessages] = useState([]);
  const [chanID, setChanID] = useState("");

  // Fetch channel details + members whenever chanID changes
  useEffect(() => {
    if (!chanID) return;

    const fetchChannelData = async () => {
      try {
        const data1 = await getChannel(chanID);
        setChannel(data1?.channel || null);

        const data2 = await getMembers(chanID);
        setMembers(data2?.members || []);

        const data3 = await getMsgHistory(chanID);
        setMessages(data3?.messages);
      } catch (err) {
        console.error("Failed to fetch channel details:", err);
        setChannel(null);
        setMembers([]);
      }
    };

    fetchChannelData();
  }, [chanID]);

  return (
    <ChannelContext.Provider
      value={{ chanID, setChanID, channel, members, messages, setMessages }}
    >
      {children}
    </ChannelContext.Provider>
  );
}

export default ChannelProvider;
