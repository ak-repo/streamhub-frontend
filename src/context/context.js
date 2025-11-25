import { createContext, useContext } from "react";

// Auth
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Action
export const ActionContext = createContext();
export const useAction = () => useContext(ActionContext);

// // Chat
// export const ChatContext = createContext();
// export const useChat = () => useContext(ChatContext);

// // file
// export const FileContext = createContext();
// export const useFile = () => useContext(FileContext);
