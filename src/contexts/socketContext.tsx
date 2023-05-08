import React, { useContext } from "react";
import io from "socket.io-client";
import fetchAPI from "../utils/fetch";

import { useLocalStorage } from "../hooks";
import { PROJECT_STUFF } from "../ts/enums/app_enums";
import {
  SocketContextAttributes,
  ConversationAttributes,
  UserAttributes,
} from "../ts/interfaces/app_interface";
const _ENDPOINT: string = PROJECT_STUFF.ENDPOINT as string;

let socket: any = io(_ENDPOINT);

const SocketContext = React.createContext<SocketContextAttributes>({});

const SocketsProvider = ({ children }: any) => {
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [roomID, setRoomID] = React.useState<string>("");
  const [conversations, setConversations] = React.useState<Object>({});
  const [userContactInfo, setUserContactInfo] = React.useState<Object>({});
  const [currentUserProfile, setCurrentUserProfile] =
    React.useState<UserAttributes>({});
  const [currentUserLoginID, setCurrentUserLoginID] = useLocalStorage("id", "");

  /* ==========================
  ? Set user connection status
  =========================== */
  React.useEffect(() => {
    const handleSetConnectStatus = (event: any) => {
      if (event.type === "beforeunload") {
        event.preventDefault();
        socket.emit("offline", currentUserLoginID);
        event.returnValue = "";
      } else if (event.type === "online" || "offline") {
        setIsOnline(navigator.onLine);
      }
    };

    window.addEventListener("online", handleSetConnectStatus);
    window.addEventListener("offline", handleSetConnectStatus);
    window.addEventListener("beforeunload", handleSetConnectStatus);

    return () => {
      window.removeEventListener("online", handleSetConnectStatus);
      window.removeEventListener("offline", handleSetConnectStatus);
      window.removeEventListener("beforeunload", handleSetConnectStatus);
    };
  }, [isOnline]);
  /* ==========================
  ? Handle on connection status
  =========================== */
  React.useEffect(() => {
    const connect_status: string = isOnline ? "ONLINE" : "OFFLINE";
    socket.emit(connect_status, currentUserLoginID);
  }, [_ENDPOINT, isOnline]);
  /* ==========================
  ? Get current user profile
  =========================== */
  React.useEffect(() => {
    (async () => {
      const { data } = await fetchAPI.get(`get-by-id/${currentUserLoginID}`);
      const { contactList, id, name, type } = data.data;
      const _currentUserProfile = { contactList, id, name, type };
      setCurrentUserProfile(_currentUserProfile);
      setCurrentUserLoginID(id);
    })();
  }, [currentUserLoginID, _ENDPOINT, isOnline]);

  socket.on("JOINED_ROOM", (roomID: string) => {
    setRoomID(roomID);
  });
  socket.on(
    "UPDATE_MESSAGE_EXPECT_SENDER",
    (serverRoomID: string, foundConversation: any) => {
      // ? Check server roomID equal client roomID
      if (serverRoomID === roomID) {
        const updatedConversation = { ...foundConversation };
        setConversations(updatedConversation);
      }
    }
  );
  socket.on(
    "CREATED_AND_JOIN_ROOM",
    (serverRoomID: string, foundConversation: any) => {
      // ? Check server roomID equal client roomID
      if (serverRoomID === roomID) {
        const updatedConversation = { ...foundConversation };
        setConversations(updatedConversation);
      }
    }
  );

  console.log(`User ${currentUserLoginID} has join room: ${roomID}`);
  return (
    <SocketContext.Provider
      value={{
        socket,
        roomID,
        isOnline,
        setRoomID,
        setIsOnline,
        conversations,
        userContactInfo,
        setConversations,
        setUserContactInfo,
        currentUserProfile,
        setCurrentUserProfile,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => useContext(SocketContext);
export default SocketsProvider;
