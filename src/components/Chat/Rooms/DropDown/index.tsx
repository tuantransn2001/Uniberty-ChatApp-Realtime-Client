import { useSocket } from "../../../../contexts/socketContext";
import UnibertyAPIServices from "../../../../services/uniberty";
import { STATUS_CODE } from "../../../../ts/enums/api_enums";
import { ObjectDynamicValueAttributes } from "../../../../ts/interfaces/global_interfaces";
import {
  UserListStyled,
  UserItemStyled,
  UserListWrapperStyled,
  UserAvatarImgStyled,
  ButtonStyled,
  SpanStyled,
} from "./styles";

interface PropsAttributes {
  userList: Array<ObjectDynamicValueAttributes>;
  handleAddToChat: Function;
}

const DropDown = ({
  userList,
  handleAddToChat,
}: PropsAttributes): JSX.Element => {
  const _socket = useSocket().socket as any;
  const _setUserContactInfo = useSocket().setUserContactInfo as Function;
  const _currentUserProfile = useSocket()
    .currentUserProfile as ObjectDynamicValueAttributes;
  const _setMessages = useSocket().setMessages as Function;
  const _setRoomID = useSocket().setRoomID as Function;

  return (
    <UserListWrapperStyled>
      <UserListStyled>
        {userList.map((user: ObjectDynamicValueAttributes) => {
          const { id, name, type, avatar } = user;
          return (
            <UserItemStyled key={`${name}${id}${type}`}>
              <ButtonStyled
                onClick={() => {
                  handleAddToChat(
                    _socket,
                    _currentUserProfile,
                    user,
                    _setUserContactInfo,
                    _setRoomID,
                    _setMessages
                  );
                }}
              >
                <UserAvatarImgStyled src={avatar} alt={`${name}`} />
                <SpanStyled>{name}</SpanStyled>
              </ButtonStyled>
            </UserItemStyled>
          );
        })}
      </UserListStyled>
    </UserListWrapperStyled>
  );
};

export default DropDown;
