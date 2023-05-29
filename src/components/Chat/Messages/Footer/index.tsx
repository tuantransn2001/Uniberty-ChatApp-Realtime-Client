import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { FooterStyled, InputStyled, buttonStyle } from "./styles";
import { Button } from "@mui/material";
import { isEmpty } from "../../../../common";
import { useSocket } from "../../../../contexts/socketContext";
import { ObjectDynamicValueAttributes } from "../../../../ts/interfaces/global_interfaces";
import { RestFullAPIAttributes } from "../../../../ts/interfaces/app_interface";
import { STATUS_CODE } from "../../../../ts/enums/api_enums";

interface ConversationAttributes {
  members: Array<{ id: string; type: string }>;
  message: {
    sender: {
      id: string;
      type: string;
    };
    content: string;
  };
}

const handleSendRoomMessage = (
  socket: any,
  conversations: Array<ObjectDynamicValueAttributes>,
  newConversationData: ConversationAttributes,
  setConversation: Function,
  inputRef: React.RefObject<HTMLInputElement>
) => {
  // * ============================================================
  // ? Check user has been chatted before
  // * ============================================================
  const AreTheyChatBefore: boolean = conversations.length > 0;

  switch (AreTheyChatBefore) {
    case true: {
      // ? They have been chatted before
      break;
    }
    case false: {
      // ! They haven't been chatted before
      // ? Step 1: Create conversation

      socket.emit("CREATE_ROOM", newConversationData);

      socket.on(
        "CREATED_AND_JOIN_ROOM_SENDER",
        (response: RestFullAPIAttributes["success"]) => {
          const {
            statusCode,
            data: { messages },
          } = response;
          switch (statusCode) {
            case STATUS_CODE.STATUS_CODE_200: {
              // ? Receive response success
              setConversation(messages);
              if (inputRef.current !== null) inputRef.current.value = "";
              break;
            }
          }
        }
      );

      break;
    }
  }
};

const Footer = ({}) => {
  const { socket } = useSocket();
  const _conversations: Array<ObjectDynamicValueAttributes> = useSocket()
    .conversations as Array<ObjectDynamicValueAttributes>;

  const _currentUserProfile = useSocket()
    .currentUserProfile as ObjectDynamicValueAttributes;

  const _userContactInfo: ObjectDynamicValueAttributes = useSocket()
    .userContactInfo as ObjectDynamicValueAttributes;

  const _setConversations: Function = useSocket().setConversations as Function;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");

  const newConversationData: ConversationAttributes = {
    members: [
      {
        id: _currentUserProfile.id,
        type: _currentUserProfile.type,
      },
      {
        id: _userContactInfo.id,
        type: _userContactInfo.type,
      },
    ],
    message: {
      sender: {
        id: _currentUserProfile.id,
        type: _currentUserProfile.type,
      },
      content: message,
    },
  };

  return (
    <FooterStyled>
      <InputStyled
        ref={inputRef}
        type="text"
        placeholder="Nhập tin nhắn"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value);
        }}
      />
      <Button
        startIcon={<SendIcon />}
        size="small"
        sx={buttonStyle}
        onClick={() => {
          handleSendRoomMessage(
            socket,
            _conversations,
            newConversationData,
            _setConversations,
            inputRef
          );
        }}
      />
    </FooterStyled>
  );
};

export default Footer;
