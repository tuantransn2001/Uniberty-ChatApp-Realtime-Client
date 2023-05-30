import { useSocket } from "../../../../contexts/socketContext";
import { ObjectDynamicValueAttributes } from "../../../../ts/interfaces/global_interfaces";

import {
  ContactListWrapperStyled,
  ContactUlTagStyled,
  ContactLiTagStyled,
  ButtonStyled,
  ImgStyled,
  InfoStyled,
  NameStyled,
  LastMessageStyled,
  MessageContentStyled,
  MessageCreatedAtStyled,
} from "./styles";
interface ContactListProps {
  handleAddToChat: Function;
}
interface ContactItemProps {
  handleAddToChat: Function;
  lastMessage: {
    content: string;
    createdAt: string;
  };
  userInfo: {
    id: string;
    name: string;
    type: string;
    avatar: string;
  };
}

const ContactItem = (props: ContactItemProps): JSX.Element => {
  const { id, name, type, avatar } = props.userInfo;
  const { createdAt, content } = props.lastMessage;
  const { handleAddToChat } = props;
  const _socket = useSocket().socket as any;
  const _currentUserProfile = useSocket()
    .currentUserProfile as ObjectDynamicValueAttributes;
  const _setUserContactInfo = useSocket().setUserContactInfo as Function;
  const _setRoomID = useSocket().setRoomID as Function;
  const _setMessages = useSocket().setMessages as Function;

  return (
    <ButtonStyled
      onClick={() => {
        handleAddToChat(
          _socket,
          _currentUserProfile,
          props.userInfo,
          _setUserContactInfo,
          _setRoomID,
          _setMessages
        );
      }}
    >
      <ImgStyled src={avatar} alt={name + type + id} width={36} height={36} />
      <InfoStyled>
        <NameStyled>{name}</NameStyled>
        <LastMessageStyled>
          <MessageContentStyled>{content}</MessageContentStyled>
          <MessageCreatedAtStyled>{createdAt}</MessageCreatedAtStyled>
        </LastMessageStyled>
      </InfoStyled>
    </ButtonStyled>
  );
};

const ContactList = (props: ContactListProps): JSX.Element => {
  const _userContactList: Array<ObjectDynamicValueAttributes> = useSocket()
    .userContactList as Array<ObjectDynamicValueAttributes>;

  return (
    <ContactListWrapperStyled>
      <ContactUlTagStyled>
        {_userContactList &&
          _userContactList.map((contactItem) => {
            const { members, messages, conversationID } = contactItem;
            const { id, name, type, avatar } = members[0];
            const { createdAt, content } = messages[messages.length - 1];
            return (
              <ContactLiTagStyled key={conversationID}>
                <ContactItem
                  handleAddToChat={props.handleAddToChat}
                  userInfo={{
                    id,
                    name,
                    type,
                    avatar,
                  }}
                  lastMessage={{
                    createdAt,
                    content,
                  }}
                />
              </ContactLiTagStyled>
            );
          })}
      </ContactUlTagStyled>
    </ContactListWrapperStyled>
  );
};

export default ContactList;
