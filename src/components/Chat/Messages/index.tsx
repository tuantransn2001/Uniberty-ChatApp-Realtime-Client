import React from "react";
import { useSocket } from "../../../contexts/socketContext";
import { isEmpty } from "../../../common";

const handleSendRoomMessage = (
  socket: any,
  messageContent: string,
  conversations: any,
  currentUserProfile: any,
  contactUserProfile: any,
  setRoomID: Function,
  setConversations: Function,
  inputRef: any
) => {
  // ? Check user has been chat before or not
  const isChatted: boolean = !isEmpty(conversations);
  if (isChatted) {
    // ? True -> Create new mess -> Push to conversation model
    const messageData = {
      conversationID: conversations.id,
      message: {
        author: currentUserProfile.id,
        content: messageContent,
        createdAt: new Date(),
      },
    };
    socket.emit("SEND_ROOM_MESSAGE", messageData);
    socket.on("UPDATE_SENDER_MESSAGE", (updateMessArr: any) => {
      setConversations((prev: any) => {
        return {
          ...prev,
          messages: updateMessArr,
        };
      });
      // ? Clear old value
      inputRef.current.value = "";
    });
  } else {
    // ? False  -> Create new conversation
    const newConverSation: Object = {
      members: [currentUserProfile.id, contactUserProfile.id],
      messages: [
        {
          author: currentUserProfile.id,
          content: messageContent,
        },
      ],
    };
    socket.emit("CREATE_ROOM", newConverSation);
    socket.on(
      "CREATED_AND_JOIN_ROOM_SENDER",
      (roomID: string, foundConversation: any) => {
        setRoomID(roomID);
        setConversations(foundConversation);
        // ? Clear old value
        inputRef.current.value = "";
      }
    );
  }
};
const renderUserContactInfo = (userContactInfo: any): JSX.Element => {
  return (
    <>
      <div>{userContactInfo?.name || "Default"}</div>
      <span>{userContactInfo?.status || "Offline"}</span>
    </>
  );
};
const renderConversations = (conversations: any): JSX.Element => {
  return (
    <ul>
      {conversations.messages
        ? conversations.messages.map(({ content, createdAt }: any) => (
            <li key={content}>
              {content} <br></br> <span>{createdAt}</span>
            </li>
          ))
        : "Render conversation here!"}
    </ul>
  );
};

export default function Messages({}): JSX.Element {
  const { socket } = useSocket();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const conversations2: Object = useSocket().conversations as Object;
  const currentUserProfile2: Object = useSocket().currentUserProfile as Object;
  const userContactInfo2: Object = useSocket().userContactInfo as Object;
  const setRoomID2: Function = useSocket().setRoomID as Function;
  const setConversations2: Function = useSocket().setConversations as Function;
  const [message, setMessage] = React.useState<string>("");

  return (
    <div style={{ marginLeft: "100px" }}>
      {renderUserContactInfo(userContactInfo2)}
      {renderConversations(conversations2)}
      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Input text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          onClick={() => {
            handleSendRoomMessage(
              socket,
              message,
              conversations2,
              currentUserProfile2,
              userContactInfo2,
              setRoomID2,
              setConversations2,
              inputRef
            );
          }}
        >{`Send message ->`}</button>
      </div>
    </div>
  );
}
