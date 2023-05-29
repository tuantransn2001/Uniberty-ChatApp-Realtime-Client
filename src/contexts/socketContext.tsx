import React, { useContext } from "react";
import io from "socket.io-client";
import { API_STUFF } from "../ts/enums/api_enums";
import { SocketContextAttributes } from "../ts/interfaces/app_interface";
import { ObjectDynamicValueAttributes } from "../ts/interfaces/global_interfaces";
const _ENDPOINT: string = API_STUFF.chat_baseURL as string;

let socket: any = io(_ENDPOINT);

const SocketContext = React.createContext<SocketContextAttributes>({});

const SocketsProvider = ({ children }: any) => {
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const [roomID, setRoomID] = React.useState<string>("");
  const [conversations, setConversations] = React.useState<
    Array<ObjectDynamicValueAttributes>
  >([]);
  const [userContactInfo, setUserContactInfo] =
    React.useState<ObjectDynamicValueAttributes>({});
  const [currentUserProfile, setCurrentUserProfile] =
    React.useState<ObjectDynamicValueAttributes>({});
  const [userContactList, setUserContactList] = React.useState<Array<any>>([]);
  /* ==========================
  ? Set user connection status
  =========================== */
  React.useEffect(() => {
    const handleSetConnectStatus = (event: any) => {
      if (event.type === "beforeunload") {
        event.preventDefault();
        socket.emit("offline", currentUserProfile.id);
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
    socket.emit(connect_status, currentUserProfile.id);
  }, [_ENDPOINT, isOnline]);

  /* ==========================
  ? Get contact list
  =========================== */
  socket.on("GET_CONTACT_LIST", (updateList: Array<any>) => {
    setUserContactList([...updateList]);
  });

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
        userContactList,
        setUserContactList,
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
