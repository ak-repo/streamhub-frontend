import React, { useEffect, useState } from "react";
import { ChannelContext, useAuth } from "./context";
import {
  getChannel,
  getMembers,
  getMsgHistory,
} from "../api/services/channelService";
import { listFilesByChannel } from "../api/services/fileService";

function ChannelProvider({ children }) {
  const [channel, setChannel] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [chanID, setChanID] = useState("");
  const { user } = useAuth();
  const [refMsg, setRefMsg] = useState(false);
  const [refFile, setRefFile] = useState(false);

  // Fetch channel details + members whenever chanID changes
  useEffect(() => {
    if (!chanID) return;

    const fetchChannelData = async () => {
      try {
        const data1 = await getChannel(chanID);
        setChannel(data1?.channel || null);

        const data2 = await getMembers(chanID);
        setMembers(Array.isArray(data2?.members) ? data2.members : []);

        const data3 = await getMsgHistory(chanID);
        setMessages(Array.isArray(data3?.messages) ? data3.messages : []);

        const data4 = await listFilesByChannel(user?.id, chanID);
        setFiles(Array.isArray(data4?.files) ? data4.files : []);
      } catch (err) {
        console.error("Failed to fetch channel details:", err);
        setChannel(null);
        setMembers([]);
        setMessages([]); // <--- safe fallback
        setFiles([]);
      }
    };

    fetchChannelData();
  }, [chanID, user?.id]);

  // Re-fetch messages when refMsg toggles
  useEffect(() => {
    if (!chanID) return;

    const fetchMSG = async () => {
      try {
        const data3 = await getMsgHistory(chanID);
        setMessages(Array.isArray(data3?.messages) ? data3.messages : []);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
        setMessages([]); // <--- safe fallback
      }
    };

    fetchMSG();
  }, [refMsg, chanID]);

  // Re-fetch messages when refMsg toggles
  useEffect(() => {
    if (!chanID) return;

    const fetchFile = async () => {
      try {
        const data = await listFilesByChannel(user?.id, chanID);
        setFiles(Array.isArray(data?.files) ? data.files : []);
      } catch (err) {
        console.error("Failed to fetch files", err);
        setFiles([]); // <--- safe fallback
      }
    };

    fetchFile();
  }, [refFile, chanID]);

  return (
    <ChannelContext.Provider
      value={{
        chanID,
        setChanID,
        channel,
        members,
        messages,
        setMessages,
        files,
        setFiles,
        refMsg,
        setRefMsg,
        refFile,
        setRefFile,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
}

export default ChannelProvider;
